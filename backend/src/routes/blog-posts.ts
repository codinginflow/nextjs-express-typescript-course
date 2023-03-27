import express from "express";
import * as BlogPostsController from "../controllers/blog-posts";
import { featuredImageUpload } from "../middlewares/image-upload";

const router = express.Router();

router.get("/", BlogPostsController.getBlogPosts);

router.post("/", featuredImageUpload.single("featuredImage"), BlogPostsController.createBlogPost);

export default router;