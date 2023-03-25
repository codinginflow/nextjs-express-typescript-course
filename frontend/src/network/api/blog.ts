import { BlogPost } from "@/models/blog-post";
import api from "@/network/axiosInstance";

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