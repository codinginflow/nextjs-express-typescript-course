import { Comment as CommentModel } from "@/models/comment";
import UserProfileLink from "../UserProfileLink";
import { formatRelativeDate } from "@/utils/utils";

interface CommentProps {
    comment: CommentModel,
}

export default function Comment({ comment }: CommentProps) {
    return (
        <div>
            <hr />
            <CommentLayout comment={comment} />
        </div>
    );
}

interface CommentLayoutProps {
    comment: CommentModel,
}

function CommentLayout({ comment }: CommentLayoutProps) {
    return (
        <div>
            <div className="mb-2">{comment.text}</div>
            <div className="d-flex gap-2 align-items-center">
                <UserProfileLink user={comment.author} />
                {formatRelativeDate(comment.createdAt)}
                {comment.updatedAt > comment.createdAt && <span>(Edited)</span>}
            </div>
        </div>
    );
}