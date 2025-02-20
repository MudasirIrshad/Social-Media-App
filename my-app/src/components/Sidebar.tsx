import { currentUser } from "@clerk/nextjs/server";
import UnAuthenticatedSidebar from "./UnAuthenticatedSidebar";
import { getUserByClerkId } from "@/actions/user.action";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { LinkIcon, MapPinIcon } from "lucide-react";

async function Sidebar() {
  const authUser = await currentUser();
  const user = await getUserByClerkId(`${authUser?.id}`);
  if (!user) return <UnAuthenticatedSidebar/>;

  if (!authUser) return <UnAuthenticatedSidebar />;
  return (
    <>
      <div>
        <div className="box-border size-320 border-2 p-4 rounded-lg ">
          <div className="text-center">
            <Link href={`/profile/${user.username}`}>
              <Avatar>
                <AvatarImage
                  src={user?.image || "/avatar.png"}
                  alt={user?.username || "User Avatar"}
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="w-8 h-8 text-xs bg-gray-200">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
            </Link>
            <p className="text-sm text-zinc-500">{user.username}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
            <div className="flex">
              <div className="p-4">
                <div>{user._count.followers}</div>
                Followers
              </div>
              <div className="p-4">
                <div>{user._count.following}</div>
                Following
              </div>
              <div className="p-4">
                <div>{user._count.posts}</div>
                Posts
              </div>
            </div>
            {user.website ? (
              <>
                <div className="text-sm text-zinc-500 mt-4">
                  <div>
                    <MapPinIcon />
                    {user.bio}
                  </div>
                  <div>
                    <LinkIcon />
                    <link rel="stylesheet" href={user.website} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-zinc-500 mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-zinc-400" />
                    <span>Not found</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-zinc-400" />
                    <span>Not found</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
