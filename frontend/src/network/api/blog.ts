import { BlogPost } from "@/models/blog-post";
import api from "@/network/axiosInstance";

export async function getBlogPosts() {
    const response = await api.get<BlogPost[]>("/posts");
    return response.data;
}

interface CreateBlogPostValues {
    slug: string,
    title: string,
    summary: string,
    body: string,
}

export async function createBlogPost(input: CreateBlogPostValues) {
    const response = await api.post<BlogPost>("/posts", input);
    return response.data;
}