"use client"
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { NotificationSkeleton } from "@/components/NotificationSkeleton";
import {
  getNotifications,
  markNotificationsAsRead,
} from "@/actions/notification.action";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];

function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await getNotifications();
        setNotifications(data);

        const unreadIds = data.filter((n) => !n.read).map((n) => n.id);
        if (unreadIds.length > 0) {
          await markNotificationsAsRead(unreadIds);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <HeartIcon className="size-5 text-red-500" />;
      case "COMMENT":
        return <MessageCircleIcon className="size-5 text-blue-500" />;
      case "FOLLOW":
        return <UserPlusIcon className="size-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="border-b p-4 mx-auto bg-white dark:bg-transparent rounded-lg shadow-md">
      {isLoading ? (
        <NotificationSkeleton />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notifications
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>

          {/* No Notifications */}
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No notifications yet
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        className="w-full h-full rounded-full object-cover"
                        src={notification.creator.image ?? "/avatar.png"}
                        alt="User Avatar"
                      />
                    </Avatar>

                    {/* Notification Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {notification.creator.username}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.type === "FOLLOW"
                          ? "Started following you"
                          : notification.type === "LIKE"
                          ? "Liked your post"
                          : "Commented on your post"}
                      </p>

                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(notification.createdAt))}
                      </span>

                      {/* Post Preview */}
                      {notification.post && (
                        <div className="mt-3 border border-gray-300 dark:border-gray-700 p-3 rounded-md bg-gray-100 dark:bg-transparent shadow-sm">
                          {notification.post.image && (
                            <img
                              src={notification.post.image}
                              alt="Post Image"
                              className="w-full max-w-[150px] h-auto rounded-md object-cover border border-gray-300 dark:border-gray-700"
                            />
                          )}
                          <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                            {notification.post.content}
                          </p>
                        </div>
                      )}

                      {/* Comment Section */}
                      {notification.comment?.content && (
                        <div className="flex items-start gap-2 border border-gray-200 dark:border-gray-700 mt-2 p-2 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-transparent">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              className="w-full h-full rounded-full object-cover"
                              src={notification.creator.image ?? "/avatar.png"}
                              alt="User Avatar"
                            />
                          </Avatar>
                          <p className="text-sm">
                            {notification.comment.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Page;
