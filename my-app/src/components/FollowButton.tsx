"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { toggleFollow } from "@/actions/user.action";

function FollowButton({
  userId,
  alreadyFollowing,
}: {
  userId: string;
  alreadyFollowing?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleFollow = async () => {
    setIsLoading(true);
    try {
      await toggleFollow(userId);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {alreadyFollowing ? (
        <Button
          onClick={handleFollow}
          className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <>Unfollow</>
          )}
        </Button>
      ) : (
        <Button
          onClick={handleFollow}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <>Follow</>
          )}
        </Button>
      )}
    </div>
  );
}

export default FollowButton;
