import { Card, CardBody, CardText, CardTitle } from "@/components/bootstrap";
import { BlogPost } from "@/models/blog-post";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import UserProfileLink from "../UserProfileLink";

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
                <CardBody>
                    <CardTitle>
                        <Link href={postLink}>
                            {title}
                        </Link>
                    </CardTitle>
                    <CardText>{summary}</CardText>
                    <CardText><UserProfileLink user={author} /></CardText>
                    <CardText className="text-muted small">
                        <time dateTime={createdAt}>
                            {formatDate(createdAt)}
                        </time>
                    </CardText>
                </CardBody>
            </article>
        </Card>
    );
}