import profilePicPlaceholder from "@/assets/images/profile-pic-placeholder.png";
import { User } from "@/models/user";
import * as UsersApi from "@/network/api/users";
import { NotFoundError } from "@/network/http-errors";
import styles from "./UserProfilePage.module.css";
import { formatDate } from "@/utils/utils";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Col, Row } from "@/components/bootstrap";
import UpdateUserProfileSection from "./UpdateUserProfileSection";
import UserBlogPostsSection from "./UserBlogPostsSection";

// This page is automatically dynamically rendered because we use params without generateStaticParams

interface UserProfilePageProps {
    params: { username: string }
}

const getUser = cache(async (username: string) => {
    try {
        return await UsersApi.getUserByUsername(username);
    } catch (error) {
        if (error instanceof NotFoundError) {
            notFound();
        } else {
            throw error;
        }
    }
})

export async function generateMetadata({ params: { username } }: UserProfilePageProps): Promise<Metadata> {
    const user = await getUser(username);

    return {
        title: `${user.username} - Flow Blog`
    }
}

export default async function UserProfilePage({ params: { username } }: UserProfilePageProps) {
    const user = await getUser(username);

    return (
        <div>
            <UserInfoSection user={user} />
            <UpdateUserProfileSection user={user} />
            <UserBlogPostsSection user={user} />
        </div>
    );
}

interface UserInfoSectionProps {
    user: User,
}

function UserInfoSection({ user: { username, displayName, profilePicUrl, about, createdAt } }: UserInfoSectionProps) {
    return (
        <Row>
            <Col sm="auto">
                <Image
                    src={profilePicUrl || profilePicPlaceholder}
                    width={200}
                    height={200}
                    alt={"Profile picture user: " + username}
                    priority
                    className={`rounded ${styles.profilePic}`}
                />
            </Col>
            <Col className="mt-2 mt-sm-0">
                <h1>{displayName}</h1>
                <div><strong>Username: </strong>{username}</div>
                <div><strong>User since: </strong>{formatDate(createdAt)}</div>
                <div className="pre-line"><strong>About me:</strong> <br /> {about || "This user hasn't shared any info yet"}</div>
            </Col>
        </Row>
    );
}

