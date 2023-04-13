import { BlogPost, BlogPostsPage } from "@/models/blog-post";
import { Comment, CommentsPage } from "@/models/comment";
import api from "@/network/axiosInstance";

export async function getBlogPosts(page: number = 1) {
    const response = await api.get<BlogPostsPage>("/posts?page=" + page);
    return response.data;
}

export async function getBlogPostsByUser(userId: string, page: number = 1) {
    const response = await api.get<BlogPostsPage>(`/posts?authorId=${userId}&page=${page}`);
    return response.data;
}

export async function getAllBlogPostSlugs() {
    const response = await api.get<string[]>("/posts/slugs");
    return response.data;
}

export async function getBlogPostBySlug(slug: string) {
    const response = await api.get<BlogPost>("/posts/post/" + slug);
    return response.data;
}

interface CreateBlogPostValues {
    slug: string,
    title: string,
    summary: string,
    body: string,
    featuredImage: File,
}

export async function createBlogPost(input: CreateBlogPostValues) {
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
        formData.append(key, value);
    });

    const response = await api.post<BlogPost>("/posts", formData);
    return response.data;
}

interface UpdateBlogPostValues {
    slug: string,
    title: string,
    summary: string,
    body: string,
    featuredImage?: File,
}

export async function updateBlogPost(blogPostId: string, input: UpdateBlogPostValues) {
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, value);
    });
    await api.patch("/posts/" + blogPostId, formData);
}

export async function deleteBlogPost(blogPostId: string) {
    await api.delete("/posts/" + blogPostId);
}

export async function uploadInPostImage(image: File) {
    const formData = new FormData();
    formData.append("inPostImage", image);
    const response = await api.post<{ imageUrl: string }>("/posts/images", formData);
    return response.data;
}

export async function getCommentsForBlogPost(blogPostId: string, continueAfterId?: string) {
    const response = await api.get<CommentsPage>(`/posts/${blogPostId}/comments?${continueAfterId ? "continueAfterId=" + continueAfterId : ""}`);
    return response.data;
}

export async function getRepliesForComment(commentId: string, continueAfterId?: string) {
    const response = await api.get<CommentsPage>(`/posts/comments/${commentId}/replies?${continueAfterId ? "continueAfterId=" + continueAfterId : ""}`);
    return response.data;
}

export async function createComment(blogPostId: string, parentCommentId: string | undefined, text: string) {
    const response = await api.post<Comment>(`/posts/${blogPostId}/comments`, { text, parentCommentId });
    return response.data;
}

export async function updateComment(commentId: string, newText: string) {
    const response = await api.patch<Comment>("/posts/comments/" + commentId, { newText });
    return response.data;
}

export async function deleteComment(commentId: string) {
    await api.delete("/posts/comments/" + commentId);
}