import * as yup from "yup";
import { imageFileSchema } from "../utils/validation";

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