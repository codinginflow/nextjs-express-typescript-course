import { BlogPostsPage } from "@/models/blog-post";
import { GetServerSideProps } from "next";
import Head from "next/head";
import * as BlogApi from "@/network/api/blog";
import BlogPostsGrid from "@/components/BlogPostsGrid";
import { stringify } from "querystring";
import PaginationBar from "@/components/PaginationBar";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<BlogPageProps> = async ({ query }) => {
    const page = parseInt(query.page?.toString() || "1");

    if (page < 1) {
        query.page = "1";
        return {
            redirect: {
                destination: "/blog?" + stringify(query),
                permanent: false,
            }
        }
    }

    const data = await BlogApi.getBlogPosts(page);

    if (data.totalPages > 0 && page > data.totalPages) {
        query.page = data.totalPages.toString();
        return {
            redirect: {
                destination: "/blog?" + stringify(query),
                permanent: false,
            }
        }
    }

    return { props: { data } };
}

interface BlogPageProps {
    data: BlogPostsPage,
}

export default function BlogPage({ data: { blogPosts, page, totalPages } }: BlogPageProps) {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Articles - Flow Blog</title>
                <meta name="description" content="Read the latest posts on Flow Blog" />
            </Head>

            <div>
                <h1>Blog</h1>
                {blogPosts.length > 0 && <BlogPostsGrid posts={blogPosts} />}
                <div className="d-flex flex-column align-items-center">
                    {blogPosts.length === 0 && <p>No blog posts found</p>}
                    {blogPosts.length > 0 &&
                        <PaginationBar
                            currentPage={page}
                            pageCount={totalPages}
                            onPageItemClicked={(page) => {
                                router.push({ query: { ...router.query, page } });
                            }}
                            className="mt-4"
                        />
                    }
                </div>
            </div>
        </>
    );
}