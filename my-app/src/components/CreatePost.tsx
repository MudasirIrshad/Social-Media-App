"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

function CreatePost() {
  const user = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;
    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        setIsPosting(false);
        toast.success("Posted Successfully");
      }
    } catch (error) {
      toast.error("Error posting");
      setIsPosting(false);
    }
  };
  return (
    <div className="mb-6 box-border border-2 p-4 rounded-lg">
      <div className="pt-6">
        <div>
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage
                src={user.user?.imageUrl || "/avatar.png"}
                className="rounded-full w-10 h-9 mb-4"
              />
            </Avatar>
            <textarea
              placeholder="what is in your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-24 border-2 border-gray-600 bg-transparent rounded-md p-4 text-sm focus:outline-none"
              disabled={isPosting}
            />
          </div>
          {(showImageUpload || imageUrl) && (
            <>
              <div className="m-4 ml-14">
                <ImageUpload
                  endpoint="postImage"
                  value={imageUrl}
                  onChange={(url) => {
                    setImageUrl(url);
                    if (!url) setShowImageUpload(false);
                  }}
                />
              </div>
            </>
          )}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => {
                  setShowImageUpload(!showImageUpload);
                }}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              variant="default"
              className="flex items-center"
              size="sm"
              onClick={handleSubmit}
              disabled={isPosting || !content}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
