import * as yup from "yup";
import { imageFileSchema, objectIdSchema } from "../utils/validation";

export const getBlogPostsSchema = yup.object({
    query: yup.object({
        authorId: objectIdSchema,
        page: yup.string(),
    }),
});

export type GetBlogPostsQuery = yup.InferType<typeof getBlogPostsSchema>["query"];

const blogPostBodySchema = yup.object({
    title: yup.string().required().max(100),
    slug: yup.string().required().max(100).matches(/^[a-zA-Z0-9_-]*$/),
    summary: yup.string().required().max(300),
    body: yup.string().required(),
});

export type BlogPostBody = yup.InferType<typeof blogPostBodySchema>;

export const createBlogPostSchema = yup.object({
    body: blogPostBodySchema,
    file: imageFileSchema.required("Featured image required"),
});

export const updateBlogPostSchema = yup.object({
    params: yup.object({
        blogPostId: objectIdSchema.required(),
    }),
    body: blogPostBodySchema,
    file: imageFileSchema,
});

export type UpdateBlogPostParams = yup.InferType<typeof updateBlogPostSchema>["params"];

export const deleteBlogPostSchema = yup.object({
    params: yup.object({
        blogPostId: objectIdSchema.required(),
    }),
});

export type DeleteBlogPostParams = yup.InferType<typeof deleteBlogPostSchema>["params"];

export const uploadInPostImageSchema = yup.object({
    file: imageFileSchema.required("Image required"),
});