import { BlogPost } from "@/models/blog-post";
import { GetStaticPaths, GetStaticProps } from "next";
import * as BlogApi from "@/network/api/blog";
import Head from "next/head";
import styles from "@/styles/BlogPostPage.module.css";
import Link from "next/link";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
import { NotFoundError } from "@/network/http-errors";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { FiEdit } from "react-icons/fi";
import useSWR from "swr";
import BlogCommentSection from "@/components/comments/BlogCommentSection";
import Markdown from "@/components/Markdown";
import UserProfileLink from "@/components/UserProfileLink";

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = await BlogApi.getAllBlogPostSlugs();

    const paths = slugs.map(slug => ({ params: { slug } }));

    return {
        paths,
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
    try {
        const slug = params?.slug?.toString();
        if (!slug) throw Error("slug missing");

        const post = await BlogApi.getBlogPostBySlug(slug);
        return { props: { fallbackPost: post } };
    } catch (error) {
        if (error instanceof NotFoundError) {
            return { notFound: true };
        } else {
            throw error;
        }
    }
}

interface BlogPostPageProps {
    fallbackPost: BlogPost,
}

export default function BlogPostPage({ fallbackPost }: BlogPostPageProps) {
    const { user } = useAuthenticatedUser();

    const { data: blogPost } = useSWR(fallbackPost.slug, BlogApi.getBlogPostBySlug, { revalidateOnFocus: false });

    const {
        _id,
        slug,
        title,
        summary,
        body,
        featuredImageUrl,
        author,
        createdAt,
        updatedAt,
    } = blogPost || fallbackPost;

    const createdUpdatedText = updatedAt > createdAt
        ? <>updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></>
        : <time dateTime={createdAt}>{formatDate(createdAt)}</time>;

    return (
        <>
            <Head>
                <title>{`${title} - Flow Blog`}</title>
                <meta name="description" content={summary} />
                <meta property="og:image" key="og:image" content={featuredImageUrl} />
            </Head>

            <div className={styles.container}>
                {user?._id === author._id &&
                    <Link
                        href={"/blog/edit-post/" + slug}
                        className="btn btn-outline-primary d-inline-flex align-items-center gap-1 mb-2">
                        <FiEdit />
                        Edit post
                    </Link>
                }

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
        </>
    );
}