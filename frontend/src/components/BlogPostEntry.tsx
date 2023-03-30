import { BlogPost } from "@/models/blog-post";
import Link from "next/link";
import { Card } from "react-bootstrap";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
import UserProfileLink from "./UserProfileLink";

interface BlogPostEntryProps {
    post: BlogPost,
    className?: string,
}

export default function BlogPostEntry({ post: { slug, title, summary, featuredImageUrl, author, createdAt }, className }: BlogPostEntryProps) {

    const postLink = "/blog/" + slug;

    return (
        <Card className={className}>
            <article>
                <Link href={postLink}>
                    <Image
                        src={featuredImageUrl}
                        alt="Blog post featured image"
                        width={550}
                        height={200}
                        className="card-img-top object-fit-cover"
                    />
                </Link>
                <Card.Body>
                    <Card.Title>
                        <Link href={postLink}>
                            {title}
                        </Link>
                    </Card.Title>
                    <Card.Text>{summary}</Card.Text>
                    <Card.Text><UserProfileLink user={author} /></Card.Text>
                    <Card.Text className="text-muted small">
                        <time dateTime={createdAt}>
                            {formatDate(createdAt)}
                        </time>
                    </Card.Text>
                </Card.Body>
            </article>
        </Card>
    );
}