import BlogPostsGrid from "@/components/blog/BlogPostsGrid";
import * as BlogApi from "@/network/api/blog";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { stringify } from "querystring";
import BlogPaginationBar from "./BlogPaginationBar";

// This page is automatically dynamically rendered because we use searchParams
// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Articles - Flow Blog",
    description: "Read the latest posts on Flow Blog",
}

interface BlogPageProps {
    searchParams: { page?: string }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const page = parseInt(searchParams.page?.toString() || "1");

    if (page < 1) {
        searchParams.page = "1";
        redirect("/blog?" + stringify(searchParams));
    }

    const { blogPosts, page: currentPage, totalPages } = await BlogApi.getBlogPosts(page);

    if (totalPages > 0 && page > totalPages) {
        searchParams.page = totalPages.toString();
        redirect("/blog?" + stringify(searchParams));
    }

    return (
        <div>
            <h1>Blog</h1>
            {blogPosts.length > 0 && <BlogPostsGrid posts={blogPosts} />}
            <div className="d-flex flex-column align-items-center">
                {blogPosts.length === 0 && <p>No blog posts found</p>}
                {blogPosts.length > 0 &&
                    <BlogPaginationBar
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                }
            </div>
        </div>
    );
}