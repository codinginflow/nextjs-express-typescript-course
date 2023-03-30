import express from "express";
import * as BlogPostsController from "../controllers/blog-posts";
import { featuredImageUpload } from "../middlewares/image-upload";
import requiresAuth from "../middlewares/requiresAuth";
import validateRequestSchema from "../middlewares/validateRequestSchema";
import { createBlogPostSchema } from "../validation/blog-posts";

const router = express.Router();

router.get("/", BlogPostsController.getBlogPosts);

router.get("/slugs", BlogPostsController.getAllBlogPostSlugs);

router.get("/post/:slug", BlogPostsController.getBlogPostBySlug);

router.post("/", requiresAuth, featuredImageUpload.single("featuredImage"), validateRequestSchema(createBlogPostSchema), BlogPostsController.createBlogPost);

export default router;