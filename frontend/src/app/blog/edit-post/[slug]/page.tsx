import { BlogPost } from "@/models/blog-post";
import * as BlogApi from "@/network/api/blog";
import { NotFoundError } from "@/network/http-errors";
import { notFound } from "next/navigation";
import EditBlogPostPage from "./EditBlogPostPage";

// This page is automatically dynamically rendered because it has a dynamic URL param but no generateStaticParams

interface PageProps {
    params: { slug: string }
}

export default async function Page({ params: { slug } }: PageProps) {
    let post: BlogPost;
    try {
        post = await BlogApi.getBlogPostBySlug(slug);
    } catch (error) {
        if (error instanceof NotFoundError) {
            notFound();
        } else {
            throw error;
        }
    }
    return <EditBlogPostPage post={post} />;
}

