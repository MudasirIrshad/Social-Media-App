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
import { SignInButton, useUser } from "@clerk/nextjs";
import { HeartIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];
function FetchPost({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string | null;
}) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.like.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.like);
  const [showComments, setShowComments] = useState(false);
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
            {post.image && (
              <div className="rounded-lg overflow-hidden ">
                <img
                  src={`${post.image}`}
                  alt="Post Image"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <div>
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-muted-foreground gap-2 ${
                    hasLiked
                      ? "text-red-500 hover:text-red-600"
                      : "hover:text-red-500"
                  }`}
                  onClick={handleLike}
                >
                  {hasLiked ? (
                    <HeartIcon className="size-5 fill-current" />
                  ) : (
                    <HeartIcon className="size-5" />
                  )}
                  <span>{optimisticLikes}</span>
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground gap-2"
                  >
                    <HeartIcon className="size-5" />
                    <span>{optimisticLikes}</span>
                  </Button>
                </SignInButton>
              )}
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-muted-foreground gap-2 hover:text-blue-500"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircleIcon
                  className={`size-5 ${
                    showComments ? "fill-blue-500 text-blue-500" : ""
                  }`}
                />
                <span>{post.comment.length}</span>
              </Button>
            </div>
            <div>
              {showComments && (
                <>
                  <div className="space-y-4">
                    {post.comment.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start space-x-3 p-3 rounded-lg shadow-sm 
                 bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {/* Avatar */}
                        <Avatar>
                          <AvatarImage
                            src={comment.author.image ?? "/avatar.png"}
                            className="rounded-full w-10 h-10"
                          />
                        </Avatar>

                        {/* Comment Content */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/profile/${comment.author.username}`}
                              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {comment.author.name}
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(comment.createdAt))}{" "}
                              ago
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {user && (
              <>
                <div className="relative border-2 border-gray-300 rounded-lg p-2 bg-transparent shadow-sm">
                  <textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isCommenting}
                    className="w-full h-14 border-none bg-transparent rounded-md p-4 text-sm focus:outline-none resize-none"
                  />
                  <button
                    onClick={handleComment}
                    disabled={isCommenting}
                    className="absolute bottom-3 right-3 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition disabled:bg-gray-400"
                  >
                    <SendIcon className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FetchPost;
