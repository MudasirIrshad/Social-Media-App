import { getProfileByUsername, getUserPosts } from "@/actions/profile.action";
import { getDbUserId } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LocateIcon, MapPinIcon } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const user = await getProfileByUsername(params.username);
  if (!user) notFound();
  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile`,
  };
}

async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await getProfileByUsername(params.username);
  // console.log(user);
  const posts = await getUserPosts(`${user?.id}`);
  // console.log(posts);
  const dbUserId = await getDbUserId();
  // console.log(dbUserId);

  return (
    <div>
      <div className="box-border border border-zinc-300 dark:border-zinc-700 p-6 rounded-xl bg-white dark:bg-zinc-900 shadow-md max-w-lg mx-auto">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20">
            <AvatarImage
              className="rounded-full object-cover w-full h-full"
              src={user?.image ?? "/avatar.png"}
              alt="User Avatar"
            />
          </Avatar>
          <h1 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {user?.name ?? user?.username}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {user?.bio ?? "No bio provided"}
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-4 flex justify-center gap-8 text-center">
          <div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {user?._count?.followers ?? 0}
            </div>
            <p className="text-sm text-zinc-500">Followers</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {user?._count?.following ?? 0}
            </div>
            <p className="text-sm text-zinc-500">Following</p>
          </div>
          <div>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {user?._count?.posts ?? 0}
            </div>
            <p className="text-sm text-zinc-500">Posts</p>
          </div>
        </div>

        {/* Follow Button */}
        {user?.id !== dbUserId ? (
          <>
            <div className="mt-4 flex justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                Follow
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}

        {/* Additional Info */}
        <div className="mt-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center gap-2">
            <MapPinIcon
              size="16"
              className="text-zinc-500 dark:text-zinc-400"
            />
            {user?.location ?? "No location provided"}
          </div>
          {user?.website && (
            <div className="flex items-center gap-2">
              <LinkIcon
                size="16"
                className="text-blue-600 dark:text-blue-400"
              />
              <a
                href={user?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {user.website}
              </a>
            </div>
          )}
        </div>
      </div>
      {/* Posts */}
      <div className="max-w-lg mx-auto mt-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Posts
        </h2>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    className="rounded-full w-full h-full object-cover"
                    src={user?.image ?? "/avatar.png"}
                    alt="User Avatar"
                  />
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {user?.name ?? "Unknown User"}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <div className="mt-3 text-zinc-700 dark:text-zinc-300 text-sm">
                {post.content}
              </div>

              {/* Post Image (If available) */}
              {post.image && (
                <div className="mt-3">
                  <img
                    src={post.image}
                    alt="Post Image"
                    className="w-full h-48 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
