import { Comment as CommentModel } from "@/models/comment";
import { useState } from "react";
import * as BlogApi from "@/network/api/blog";
import Comment from "./Comment";
import { Button, Spinner } from "react-bootstrap";

interface CommentThreadProps {
    comment: CommentModel,
    onCommentUpdated: (updatedComment: CommentModel) => void,
    onCommentDeleted: (comment: CommentModel) => void,
}

export default function CommentThread({ comment, onCommentUpdated, onCommentDeleted }: CommentThreadProps) {
    const [replies, setReplies] = useState<CommentModel[]>([]);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [repliesLoadingIsError, setRepliesLoadingIsError] = useState(false);

    const [repliesPaginationEnd, setRepliesPaginationEnd] = useState<boolean>();

    const [localReplies, setLocalReplies] = useState<CommentModel[]>([]);

    async function loadNextRepliesPage() {
        const continueAfterId = replies[replies.length - 1]?._id;
        try {
            setRepliesLoading(true);
            setRepliesLoadingIsError(false);
            const response = await BlogApi.getRepliesForComment(comment._id, continueAfterId);
            setReplies([...replies, ...response.comments]);
            setRepliesPaginationEnd(response.endOfPaginationReached);
            setLocalReplies([]);
        } catch (error) {
            console.error(error);
            setRepliesLoadingIsError(true);
        } finally {
            setRepliesLoading(false);
        }
    }

    function handleReplyCreated(reply: CommentModel) {
        setLocalReplies([...localReplies, reply]);
    }

    function handleRemoteReplyUpdated(updatedReply: CommentModel) {
        const update = replies.map(existingReply => existingReply._id === updatedReply._id ? updatedReply : existingReply);
        setReplies(update);
    }

    function handleRemoteReplyDeleted(deletedReply: CommentModel) {
        const update = replies.filter(reply => reply._id !== deletedReply._id);
        setReplies(update);
    }

    function handleLocalReplyUpdated(updatedReply: CommentModel) {
        const update = localReplies.map(existingReply => existingReply._id === updatedReply._id ? updatedReply : existingReply);
        setLocalReplies(update);
    }

    function handleLocalReplyDeleted(deletedReply: CommentModel) {
        const update = localReplies.filter(reply => reply._id !== deletedReply._id);
        setLocalReplies(update);
    }

    const showLoadRepliesButton = !!comment.repliesCount && !repliesLoading && !repliesPaginationEnd;

    return (
        <div>
            <Comment
                comment={comment}
                onReplyCreated={handleReplyCreated}
                onCommentUpdated={onCommentUpdated}
                onCommentDeleted={onCommentDeleted}
            />
            <Replies
                replies={replies}
                onReplyCreated={handleReplyCreated}
                onReplyUpdated={handleRemoteReplyUpdated}
                onReplyDeleted={handleRemoteReplyDeleted}
            />
            <div className="mt-2 text-center">
                {repliesLoading && <Spinner animation="border" />}
                {repliesLoadingIsError && <p>Replies could not be loaded.</p>}
                {showLoadRepliesButton &&
                    <Button
                        variant="outline-primary"
                        onClick={loadNextRepliesPage}>
                        {repliesPaginationEnd === undefined
                            ? `Show ${comment.repliesCount} ${comment.repliesCount === 1 ? "reply" : "replies"}`
                            : "Show more replies"
                        }
                    </Button>
                }
            </div>
            <Replies
                replies={localReplies}
                onReplyCreated={handleReplyCreated}
                onReplyUpdated={handleLocalReplyUpdated}
                onReplyDeleted={handleLocalReplyDeleted}
            />
        </div>
    );
}

interface RepliesProps {
    replies: CommentModel[],
    onReplyCreated: (reply: CommentModel) => void,
    onReplyUpdated: (updatedReply: CommentModel) => void,
    onReplyDeleted: (reply: CommentModel) => void,
}

function Replies({ replies, onReplyCreated, onReplyUpdated, onReplyDeleted }: RepliesProps) {
    return (
        <div className="ms-5">
            {replies.map(reply => (
                <Comment
                    comment={reply}
                    key={reply._id}
                    onReplyCreated={onReplyCreated}
                    onCommentUpdated={onReplyUpdated}
                    onCommentDeleted={onReplyDeleted}
                />
            ))}
        </div>
    );
}