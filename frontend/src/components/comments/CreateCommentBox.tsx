import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { Comment } from "@/models/comment";
import { useContext, useEffect } from "react";
import * as yup from "yup";
import { AuthModalsContext } from "../auth/AuthModalsProvider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as BlogApi from "@/network/api/blog";
import { Button, Form } from "react-bootstrap";
import FormInputField from "../form/FormInputField";
import LoadingButton from "../LoadingButton";

const validationSchema = yup.object({
    text: yup.string(),
});

type CreateCommentInput = yup.InferType<typeof validationSchema>;

interface CreateCommentBoxProps {
    blogPostId: string,
    parentCommentId?: string,
    title: string,
    onCommentCreated: (comment: Comment) => void,
    showCancel?: boolean,
    onCancel?: () => void,
    defaultText?: string,
}

export default function CreateCommentBox({ blogPostId, parentCommentId, title, onCommentCreated, showCancel, onCancel, defaultText }: CreateCommentBoxProps) {
    const { user } = useAuthenticatedUser();
    const authModalsContext = useContext(AuthModalsContext);

    const { register, handleSubmit, formState: { isSubmitting }, reset, setFocus } = useForm<CreateCommentInput>({
        defaultValues: { text: defaultText || "" },
        resolver: yupResolver(validationSchema),
    });

    async function onSubmit({ text }: CreateCommentInput) {
        if (!text) return;

        try {
            const createdComment = await BlogApi.createComment(blogPostId, parentCommentId, text);
            onCommentCreated(createdComment);
            reset();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    useEffect(() => {
        if (parentCommentId) {
            setFocus("text");
        }
    }, [parentCommentId, setFocus]);

    if (!user) {
        return (
            <Button
                variant="outline-primary"
                className="mt-1"
                onClick={() => authModalsContext.showLoginModal()}>
                Log in to write a comment
            </Button>
        );
    }

    return (
        <div className="mt-2">
            <div className="mb-1">{title}</div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    register={register("text")}
                    as="textarea"
                    maxLength={600}
                    placeholder="Say something..."
                />
                <LoadingButton type="submit" isLoading={isSubmitting}>Send</LoadingButton>
                {showCancel && <Button onClick={onCancel} className="ms-2" variant="outline-primary">Cancel</Button>}
            </Form>
        </div>
    );
}