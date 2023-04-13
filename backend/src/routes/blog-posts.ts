import express from "express";
import * as BlogPostsController from "../controllers/blog-posts";
import { featuredImageUpload, inPostImageUpload } from "../middlewares/image-upload";
import requiresAuth from "../middlewares/requiresAuth";
import validateRequestSchema from "../middlewares/validateRequestSchema";
import { createBlogPostSchema, deleteBlogPostSchema, getBlogPostsSchema, updateBlogPostSchema, uploadInPostImageSchema } from "../validation/blog-posts";
import { createPostRateLimit, updatePostRateLimit, uploadImageRateLimit } from "../middlewares/rate-limit";
import { createCommentSchema, deleteCommentSchema, getCommentRepliesSchema, getCommentsSchema, updateCommentSchema } from "../validation/comments";

const router = express.Router();

router.get("/", validateRequestSchema(getBlogPostsSchema), BlogPostsController.getBlogPosts);

router.get("/slugs", BlogPostsController.getAllBlogPostSlugs);

router.get("/post/:slug", BlogPostsController.getBlogPostBySlug);

router.post("/", requiresAuth, createPostRateLimit, featuredImageUpload.single("featuredImage"), validateRequestSchema(createBlogPostSchema), BlogPostsController.createBlogPost);

router.patch("/:blogPostId", requiresAuth, updatePostRateLimit, featuredImageUpload.single("featuredImage"), validateRequestSchema(updateBlogPostSchema), BlogPostsController.updateBlogPost);

router.delete("/:blogPostId", requiresAuth, validateRequestSchema(deleteBlogPostSchema), BlogPostsController.deleteBlogPost);

router.post("/images", requiresAuth, uploadImageRateLimit, inPostImageUpload.single("inPostImage"), validateRequestSchema(uploadInPostImageSchema), BlogPostsController.uploadInPostImage);

router.get("/:blogPostId/comments", validateRequestSchema(getCommentsSchema), BlogPostsController.getCommentsForBlogPost);

router.post("/:blogPostId/comments", requiresAuth, validateRequestSchema(createCommentSchema), BlogPostsController.createComment);

router.get("/comments/:commentId/replies", validateRequestSchema(getCommentRepliesSchema), BlogPostsController.getCommentReplies);

router.patch("/comments/:commentId", requiresAuth, validateRequestSchema(updateCommentSchema), BlogPostsController.updateComment);

router.delete("/comments/:commentId", requiresAuth, validateRequestSchema(deleteCommentSchema), BlogPostsController.deleteComment);

export default router;