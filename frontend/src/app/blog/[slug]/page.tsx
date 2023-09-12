import Markdown from "@/components/Markdown";
import UserProfileLink from "@/components/UserProfileLink";
import BlogCommentSection from "@/components/comments/BlogCommentSection";
import * as BlogApi from "@/network/api/blog";
import { NotFoundError } from "@/network/http-errors";
import { formatDate } from "@/utils/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import styles from "./BlogPostPage.module.css";
import EditPostButton from "./EditPostButton";
import { unstable_cache } from "next/cache";

// This page is statically rendered and only updates after manual revalidation

interface BlogPostPageProps {
    params: { slug: string }
}

const getPost = (slug: string) => unstable_cache(async function (slug: string) {
    try {
        return await BlogApi.getBlogPostBySlug(slug);
    } catch (error) {
        if (error instanceof NotFoundError) {
            notFound();
        } else {
            throw error;
        }
    }
},
    [slug],
    { tags: [slug] }
)(slug);

export async function generateMetadata({ params: { slug } }: BlogPostPageProps): Promise<Metadata> {
    const blogPost = await getPost(slug);

    return {
        title: `${blogPost.title} - Flow Blog`,
        description: blogPost.summary,
        openGraph: {
            images: [{ url: blogPost.featuredImageUrl }]
        }
    }
}

export async function generateStaticParams() {
    const slugs = await BlogApi.getAllBlogPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params: { slug } }: BlogPostPageProps) {

    const {
        _id,
        title,
        summary,
        body,
        featuredImageUrl,
        author,
        createdAt,
        updatedAt,
    } = await getPost(slug);

    const createdUpdatedText = updatedAt > createdAt
        ? <>updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></>
        : <time dateTime={createdAt}>{formatDate(createdAt)}</time>;

    return (
        <div className={styles.container}>
            <EditPostButton authorId={author._id} slug={slug} />

            <div className="text-center mb-4">
                <Link href="/blog">← Blog Home</Link>
            </div>

            <article>
                <div className="d-flex flex-column align-items-center">
                    <h1 className="text-center mb-3">{title}</h1>
                    <p className="text-center mb-3 h5">{summary}</p>
                    <p className="d-flex gap-2 align-items-center">
                        posted by
                        <UserProfileLink user={author} />
                    </p>
                    <span className="text-muted">{createdUpdatedText}</span>
                    <div className={styles.featuredImageWrapper}>
                        <Image
                            src={featuredImageUrl}
                            alt="Blog post featured image"
                            fill
                            sizes="(max-width: 768px) 100vw, 700px"
                            priority
                            className="rounded"
                        />
                    </div>
                </div>
                <Markdown>{body}</Markdown>
            </article>
            <hr />
            <BlogCommentSection blogPostId={_id} />
        </div>
    );
}