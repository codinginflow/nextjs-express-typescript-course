import express from "express";
import * as BlogPostsController from "../controllers/blog-posts";

const router = express.Router();

router.get("/", BlogPostsController.getBlogPosts);

router.post("/", BlogPostsController.createBlogPost);

export default router;