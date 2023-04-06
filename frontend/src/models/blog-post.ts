import { User } from "./user";

export interface BlogPost {
    _id: string,
    slug: string,
    title: string,
    summary: string,
    body: string,
    featuredImageUrl: string,
    author: User,
    createdAt: string,
    updatedAt: string,
}

export interface BlogPostsPage {
    blogPosts: BlogPost[],
    page: number,
    totalPages: number,
}