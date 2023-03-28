import { BlogPost } from "@/models/blog-post";
import { GetStaticPaths, GetStaticProps } from "next";
import * as BlogApi from "@/network/api/blog";
import Head from "next/head";
import styles from "@/styles/BlogPostPage.module.css";
import Link from "next/link";
import { formatDate } from "@/utils/utils";
import Image from "next/image";

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = await BlogApi.getAllBlogPostSlugs();

    const paths = slugs.map(slug => ({ params: { slug } }));

    return {
        paths,
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
    const slug = params?.slug?.toString();
    if (!slug) throw Error("slug missing");

    const post = await BlogApi.getBlogPostBySlug(slug);
    return { props: { post } };
}

interface BlogPostPageProps {
    post: BlogPost,
}

export default function BlogPostPage({ post: { _id, slug, title, summary, body, featuredImageUrl, createdAt, updatedAt } }: BlogPostPageProps) {

    const createdUpdatedText = updatedAt > createdAt
        ? <>updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></>
        : <time dateTime={createdAt}>{formatDate(createdAt)}</time>;

    return (
        <>
            <Head>
                <title>{`${title} - Flow Blog`}</title>
                <meta name="description" content={summary} />
            </Head>

            <div className={styles.container}>
                <div className="text-center mb-4">
                    <Link href="/blog">← Blog Home</Link>
                </div>

                <article>
                    <div className="d-flex flex-column align-items-center">
                        <h1 className="text-center mb-3">{title}</h1>
                        <p className="text-center mb-3 h5">{summary}</p>
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
                    <div>
                        {body}
                    </div>
                </article>
            </div>
        </>
    );
}