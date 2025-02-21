"use client";
import {
  createComment,
  deletePost,
  getPosts,
  toggleLike,
} from "@/actions/post.action";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import DeleteAlertDialg from "./DeleteAlertDialog";
type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];
function FetchPost({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) {
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.like.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.like);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked(!hasLiked);
      setOptimisticLikes(hasLiked ? optimisticLikes - 1 : optimisticLikes + 1);
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.like);
      setHasLiked(post.like.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };
  const handleComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        setNewComment("");
        toast.success("Commented successfully");
      }
    } catch (error) {
      toast.error("Error commenting");
    } finally {
      setIsCommenting(false);
    }
  };
  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result?.success) toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Error deleting post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden box-border border-2">
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex space-x-3 sm:space-x-4">
              <Link href={`/profile/${post.author.username}`}>
                <Avatar>
                  <AvatarImage
                    src={post.author.image ?? "/avatar.png"}
                    className="rounded-full w-12 h-12 mr-2"
                  />
                </Avatar>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                    <Link href={`/profile/${post.author.username}`}>
                      {post.author.name}
                    </Link>
                    <span>.</span>
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(post.createdAt))}
                    </span>
                  </div>
                </div>
                <div>
                  <div>
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="text-gray-500 text-sm"
                    >
                      {post.author.username}
                    </Link>
                  </div>
                  {post.content}
                </div>
              </div>
              {dbUserId == post.author.id && (
                <DeleteAlertDialg
                  des={
                    "This action cannot be undone. This will permanently delete your post."
                  }
                  onDelete={handleDeletePost}
                  isDeleting={isDeleting}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FetchPost;
