import * as yup from "yup";
import { objectIdSchema } from "../utils/validation";

const commentTextSchema = yup.string().required().max(600);

export const getCommentsSchema = yup.object({
    params: yup.object({
        blogPostId: objectIdSchema.required(),
    }),
    query: yup.object({
        continueAfterId: objectIdSchema,
    }),
});

export type GetCommentsParams = yup.InferType<typeof getCommentsSchema>["params"];
export type GetCommentsQuery = yup.InferType<typeof getCommentsSchema>["query"];

export const createCommentSchema = yup.object({
    body: yup.object({
        text: commentTextSchema,
        parentCommentId: objectIdSchema,
    }),
    params: yup.object({
        blogPostId: objectIdSchema.required(),
    }),
});

export type CreateCommentParams = yup.InferType<typeof createCommentSchema>["params"];
export type CreateCommentBody = yup.InferType<typeof createCommentSchema>["body"];