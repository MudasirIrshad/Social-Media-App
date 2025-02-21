"use client";

import {
  getNotifications,
  markNotificationsAsRead,
} from "@/actions/notification.action";
import { NotificationSkeleton } from "@/components/NotificationSkeleton";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import { HeartIcon, MessageCircleIcon, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Notifications = Awaited<ReturnType<typeof getNotifications>>;
type Notification = Notifications[number];
function page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await getNotifications();
        setNotifications(data);
        console.log(data);

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
        return <HeartIcon className="size-4 text-red-500" />;
      case "COMMENT":
        return <MessageCircleIcon className="size-4 text-blue-500" />;
      case "FOLLOW":
        return <UserPlusIcon className="size-4 text-green-500" />;
      default:
        return null;
    }
  };
  return (
    <div className="border-b">
      {isLoading ? (
        <NotificationSkeleton />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1>Notifications</h1>
            <span className="text-sm text-muted-foreground">
              {notifications.filter((n) => !n.read).length}
            </span>
          </div>
          <div>
            {notifications.length == 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  No notifications yet
                </p>
              </>
            ) : (
              <>
                <div>
                  {notifications.map((notification) => (
                    <div
                      className="box-border border-2 m-2 p-2 rounded-lg"
                      key={notification.id}
                    >
                      <div className="flex items-center space-x-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                        <Avatar>
                          <AvatarImage
                            className="w-10 h-10 rounded-full object-cover"
                            src={notification.creator.image ?? "/avatar.png"}
                          />
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {notification.creator.username}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                            {getNotificationIcon(notification.type)}
                            <span>
                              {notification.type === "FOLLOW"
                                ? "Started following you"
                                : notification.type === "LIKE"
                                ? "Liked your post"
                                : "Commented on your post"}
                            </span>
                            <span>
                              {formatDistanceToNow(
                                new Date(notification.createdAt)
                              )}
                            </span>
                          </div>
                          <div>{notification.post && <>
                          <div>
                            <div>
                              <p>{notification.post.image}</p>
                              <p>{notification.post.content}</p>
                            </div>
                          </div>
                          </>}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default page;
