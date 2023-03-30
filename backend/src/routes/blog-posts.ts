import express from "express";
import * as BlogPostsController from "../controllers/blog-posts";
import { featuredImageUpload } from "../middlewares/image-upload";
import requiresAuth from "../middlewares/requiresAuth";

const router = express.Router();

router.get("/", BlogPostsController.getBlogPosts);

router.get("/slugs", BlogPostsController.getAllBlogPostSlugs);

router.get("/post/:slug", BlogPostsController.getBlogPostBySlug);

router.post("/", requiresAuth, featuredImageUpload.single("featuredImage"), BlogPostsController.createBlogPost);

export default router;