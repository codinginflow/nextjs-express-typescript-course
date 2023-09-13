"use client";

import LoadingButton from "@/components/LoadingButton";
import FormInputField from "@/components/form/FormInputField";
import MarkdownEditor from "@/components/form/MarkdownEditor";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import useAutoSave from "@/hooks/useAutoSave";
import * as BlogApi from "@/network/api/blog";
import { generateSlug } from "@/utils/utils";
import { requiredFileSchema, requiredStringSchema, slugSchema } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const validationSchema = yup.object({
    slug: slugSchema.required("Required"),
    title: requiredStringSchema,
    summary: requiredStringSchema,
    body: requiredStringSchema,
    featuredImage: requiredFileSchema,
});

type CreatePostFormData = yup.InferType<typeof validationSchema>;

export default function CreateBlogPostPage() {
    const { user, userLoading } = useAuthenticatedUser();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, getValues, watch, reset, formState: { errors } } = useForm<CreatePostFormData>({
        resolver: yupResolver(validationSchema),
    });

    const { getValue: getAutoSavedValue, clearValue: clearAutoSavedValue } =
        useAutoSave("new-post-input", { ...watch(), featuredImage: undefined });

    useEffect(() => {
        const autoSavedValue = getAutoSavedValue();
        if (autoSavedValue) {
            reset(autoSavedValue);
        }
    }, [getAutoSavedValue, reset]);

    async function onSubmit({ title, slug, summary, featuredImage, body }: CreatePostFormData) {
        setIsSubmitting(true);
        try {
            await BlogApi.createBlogPost({ title, slug, summary, featuredImage: featuredImage[0], body });
            clearAutoSavedValue();
            router.push("/blog/" + slug);
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
            alert(error);
        }
    }

    function generateSlugFromTitle() {
        if (getValues("slug")) return;
        const slug = generateSlug(getValues("title"));
        setValue("slug", slug, { shouldValidate: true });
    }

    if (!userLoading && !user) router.push("/");

    if (userLoading) {
        return <Spinner animation="border" className="d-block m-auto" />;
    }

    return (
        <div>
            <h1>Create a post</h1>
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
                <LoadingButton type="submit" isLoading={isSubmitting}>Create post</LoadingButton>
            </Form>
        </div>
    );
}