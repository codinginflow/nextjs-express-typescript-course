import { Comment as CommentModel } from "@/models/comment";
import UserProfileLink from "../UserProfileLink";
import { formatRelativeDate } from "@/utils/utils";
import EditCommentBox from "./EditCommentBox";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { useContext, useState } from "react";
import { AuthModalsContext } from "../auth/AuthModalsProvider";
import { Button } from "react-bootstrap";
import CreateCommentBox from "./CreateCommentBox";
import { NotFoundError } from "@/network/http-errors";
import * as BlogApi from "@/network/api/blog";

interface CommentProps {
    comment: CommentModel,
    onReplyCreated: (reply: CommentModel) => void,
    onCommentUpdated: (updatedComment: CommentModel) => void,
    onCommentDeleted: (comment: CommentModel) => void,
}

export default function Comment({ comment, onReplyCreated, onCommentUpdated, onCommentDeleted }: CommentProps) {
    const { user } = useAuthenticatedUser();

    const authModalsContext = useContext(AuthModalsContext);

    const [showEditBox, setShowEditBox] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    function handleReplyClick() {
        if (user) {
            setShowReplyBox(true);
        } else {
            authModalsContext.showLoginModal();
        }
    }

    function handleEditClick() {
        setShowEditBox(true);
        setShowDeleteConfirmation(false);
    }

    function handleReplyCreated(newReply: CommentModel) {
        onReplyCreated(newReply);
        setShowReplyBox(false);
    }

    function handleCommentUpdated(updatedComment: CommentModel) {
        onCommentUpdated(updatedComment);
        setShowEditBox(false);
    }

    return (
        <div>
            <hr />
            {showEditBox
                ? <EditCommentBox
                    comment={comment}
                    onCommentUpdated={handleCommentUpdated}
                    onCancel={() => setShowEditBox(false)}
                />
                : <CommentLayout
                    comment={comment}
                    onReplyClicked={handleReplyClick}
                    onEditClicked={handleEditClick}
                    onDeleteClicked={() => setShowDeleteConfirmation(true)}
                />
            }
            {showReplyBox &&
                <CreateCommentBox
                    blogPostId={comment.blogPostId}
                    title="Write a reply"
                    onCommentCreated={handleReplyCreated}
                    parentCommentId={comment.parentCommentId ?? comment._id}
                    showCancel
                    onCancel={() => setShowReplyBox(false)}
                    defaultText={comment.parentCommentId ? `@${comment.author.username} ` : ""}
                />
            }
            {showDeleteConfirmation &&
                <DeleteConfirmation
                    comment={comment}
                    onCommentDeleted={onCommentDeleted}
                    onCancel={() => setShowDeleteConfirmation(false)}
                />
            }
        </div>
    );
}

interface CommentLayoutProps {
    comment: CommentModel,
    onReplyClicked: () => void,
    onEditClicked: () => void,
    onDeleteClicked: () => void,
}

function CommentLayout({ comment, onReplyClicked, onEditClicked, onDeleteClicked }: CommentLayoutProps) {
    const { user } = useAuthenticatedUser();

    const loggedInUserIsAuthor = (user && (user._id === comment.author._id)) || false;

    return (
        <div>
            <div className="mb-2">{comment.text}</div>
            <div className="d-flex gap-2 align-items-center">
                <UserProfileLink user={comment.author} />
                {formatRelativeDate(comment.createdAt)}
                {comment.updatedAt > comment.createdAt && <span>(Edited)</span>}
            </div>
            <div className="mt-1 d-flex gap-2">
                <Button
                    variant="link"
                    className="small"
                    onClick={onReplyClicked}>
                    Reply
                </Button>
                {loggedInUserIsAuthor &&
                    <>
                        <Button
                            variant="link"
                            className="small"
                            onClick={onEditClicked}>
                            Edit
                        </Button>
                        <Button
                            variant="link"
                            className="small"
                            onClick={onDeleteClicked}>
                            Delete
                        </Button>
                    </>
                }
            </div>
        </div>
    );
}

interface DeleteConfirmationProps {
    comment: CommentModel,
    onCommentDeleted: (comment: CommentModel) => void,
    onCancel: () => void,
}

function DeleteConfirmation({ comment, onCommentDeleted, onCancel }: DeleteConfirmationProps) {
    const [deleteInProgress, setDeleteInProgress] = useState(false);

    async function deleteComment() {
        try {
            setDeleteInProgress(true);
            await BlogApi.deleteComment(comment._id);
            onCommentDeleted(comment);
        } catch (error) {
            console.error(error);
            if (error instanceof NotFoundError) {
                onCommentDeleted(comment);
            } else {
                alert(error);
            }
        } finally {
            setDeleteInProgress(false);
        }
    }

    return (
        <div>
            <p className="text-danger">Do you really want to delete this comment?</p>
            <Button
                variant="danger"
                onClick={deleteComment}
                disabled={deleteInProgress}>
                Delete
            </Button>
            <Button
                variant="outline-danger"
                className="ms-2"
                onClick={onCancel}>
                Cancel
            </Button>
        </div>
    );
}