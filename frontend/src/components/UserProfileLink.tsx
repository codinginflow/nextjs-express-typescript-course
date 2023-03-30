import { User } from "@/models/user";
import Image from "next/image";
import profilePicPlaceholder from "@/assets/images/profile-pic-placeholder.png";
import Link from "next/link";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { formatDate } from "@/utils/utils";

interface UserProfileLinkProps {
    user: User,
}

export default function UserProfileLink({ user }: UserProfileLinkProps) {
    return (
        <OverlayTrigger
            overlay={
                <Tooltip className="position-absolute">
                    <UserTooltipContent user={user} />
                </Tooltip>
            }
            delay={{ show: 500, hide: 0 }}
        >
            <span className="d-flex align-items-center w-fit-content">
                <Image
                    src={user.profilePicUrl || profilePicPlaceholder}
                    width={40}
                    height={40}
                    alt={"Profile pic user: " + user.username}
                    className="rounded-circle"
                />
                <Link href={"/users/" + user.username} className="ms-2">
                    {user.displayName}
                </Link>
            </span>
        </OverlayTrigger>
    );
}

interface UserTooltipContentProps {
    user: User,
}

function UserTooltipContent({ user: { username, about, profilePicUrl, createdAt } }: UserTooltipContentProps) {
    return (
        <div className="p-2">
            <Image
                src={profilePicUrl || profilePicPlaceholder}
                width={150}
                height={150}
                alt={"Profile pic user: " + username}
                className="rounded-circle mb-1"
            />
            <div className="text-start">
                <strong>Username:</strong> {username} <br/>
                <strong>User since:</strong> {formatDate(createdAt)} <br/>
                { about && <><strong>About:</strong> {about}</> }
            </div>
        </div>
    );
}