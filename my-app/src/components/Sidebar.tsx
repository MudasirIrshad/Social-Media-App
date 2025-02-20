import { currentUser } from "@clerk/nextjs/server";
import UnAuthenticatedSidebar from "./UnAuthenticatedSidebar";
import { getUserByClerkId } from "@/actions/user.action";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

async function Sidebar() {
  const authUser = await currentUser();
  const user = await getUserByClerkId(authUser?.id);
  if (!user) return null;
  console.log("Side bar", { user });

  if (!authUser) return <UnAuthenticatedSidebar />;
  return (
    <>
      <div>
        <div className="box-border size-320 border-2 p-4 rounded-lg ">
          <div className="text-center">
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
            <p>{user.bio}</p>
            <p>{user.website}</p>
            <p>{user.location}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
