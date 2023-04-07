import { BlogPost } from "@/models/blog-post";
import { GetServerSideProps } from "next";
import * as BlogApi from "@/network/api/blog";
import { NotFoundError } from "@/network/http-errors";
import * as yup from "yup";
import { requiredStringSchema, slugSchema } from "@/utils/validation";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form, Spinner } from "react-bootstrap";
import FormInputField from "@/components/form/FormInputField";
import MarkdownEditor from "@/components/form/MarkdownEditor";
import LoadingButton from "@/components/LoadingButton";
import { generateSlug } from "@/utils/utils";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";
import useUnsavedChangesWarning from "@/hooks/useUnsavedChangesWarning";

export const getServerSideProps: GetServerSideProps<EditBlogPostPageProps> = async ({ params }) => {
    try {
        const slug = params?.slug?.toString();
        if (!slug) throw Error("slug missing");

        const post = await BlogApi.getBlogPostBySlug(slug);
        return { props: { post } };
    } catch (error) {
        if (error instanceof NotFoundError) {
            return { notFound: true };
        } else {
            throw error;
        }
    }
}

interface EditBlogPostPageProps {
    post: BlogPost,
}

const validationSchema = yup.object({
    slug: slugSchema.required("Required"),
    title: requiredStringSchema,
    summary: requiredStringSchema,
    body: requiredStringSchema,
    featuredImage: yup.mixed<FileList>(),
});

type EditPostFormData = yup.InferType<typeof validationSchema>;

export default function EditBlogPostPage({ post }: EditBlogPostPageProps) {
    const { user, userLoading } = useAuthenticatedUser();
    const router = useRouter();

    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
    const [deletePending, setDeletePending] = useState(false);

    const { register, handleSubmit, setValue, getValues, watch, formState: { errors, isSubmitting, isDirty } } = useForm<EditPostFormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            slug: post.slug,
            title: post.title,
            summary: post.summary,
            body: post.body,
        }
    });

    async function onSubmit({ slug, title, summary, body, featuredImage }: EditPostFormData) {
        try {
            await BlogApi.updateBlogPost(post._id, { slug, title, summary, body, featuredImage: featuredImage?.item(0) || undefined })
            await router.push("/blog/" + slug);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function onDeleteConfirmed() {
        setShowDeleteConfirmationDialog(false);
        setDeletePending(true);
        try {
            await BlogApi.deleteBlogPost(post._id);
            router.push("/blog");
        } catch (error) {
            setDeletePending(false);
            console.error(error);
            alert(error);
        }
    }

    function generateSlugFromTitle() {
        if (getValues("slug")) return;
        const slug = generateSlug(getValues("title"));
        setValue("slug", slug, { shouldValidate: true });
    }

    useUnsavedChangesWarning(isDirty && !isSubmitting && !deletePending);

    const userIsAuthorized = (user && user._id === post.author._id) || false;

    if (!userLoading && !userIsAuthorized) {
        return <p>You are not authorized to edit this post</p>;
    }

    if (userLoading) return <Spinner animation="border" className="d-block m-auto" />

    return (
        <div>
            <h1>Edit post</h1>
            {userIsAuthorized &&
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormInputField
                        label="Post title"
                        register={register("title")}
                        placeholder="Post title"
                        maxLength={100}
                        error={errors.title}
                        onBlur={generateSlugFromTitle}
                    />
                    <FormInputField
                        label="Post slug"
                        register={register("slug")}
                        placeholder="Post slug"
                        maxLength={100}
                        error={errors.slug}
                    />
                    <FormInputField
                        label="Post summary"
                        register={register("summary")}
                        placeholder="Post summary"
                        maxLength={300}
                        as="textarea"
                        error={errors.summary}
                    />
                    <FormInputField
                        label="Post image"
                        register={register("featuredImage")}
                        type="file"
                        accept="image/png,image/jpeg"
                        error={errors.featuredImage}
                    />
                    <MarkdownEditor
                        label="Post body"
                        register={register("body")}
                        watch={watch}
                        setValue={setValue}
                        error={errors.body}
                    />
                    <div className="d-flex justify-content-between">
                        <LoadingButton
                            type="submit"
                            isLoading={isSubmitting}
                            disabled={deletePending}>Update post
                        </LoadingButton>
                        <Button
                            onClick={() => setShowDeleteConfirmationDialog(true)}
                            variant="outline-danger"
                            disabled={deletePending}>
                            Delete post
                        </Button>
                    </div>
                </Form>
            }
            <ConfirmationModal
                show={showDeleteConfirmationDialog}
                title="Confirm delete"
                message="Do you really want to delete this post?"
                confirmButtonText="Delete"
                onCancel={() => setShowDeleteConfirmationDialog(false)}
                onConfirm={onDeleteConfirmed}
                variant="danger"
            />
        </div>
    );
}