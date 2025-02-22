import { getRandomUsers } from "@/actions/user.action";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import FollowButton from "./FollowButton";

async function Recommendations() {
  const users = await getRandomUsers();
  if (users.length === 0) return null;
  return (
    <div>
      <h2 className="text-lg font-semibold">Recommendations</h2>
      <div className="flex box-border rounded-lg w-full p-2 border-2 ">
        <div className="space-y-4 w-full">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col items-center gap-4 w-full p-4 border rounded-lg bg-white dark:bg-zinc-900 shadow-md"
            >
              {/* Profile Info */}
              <div className="flex items-center gap-4 w-full">
                {/* Avatar */}
                <Link href={`/profile/${user.username}`} className="shrink-0">
                  <Avatar>
                    <AvatarImage
                      src={user.image ?? "/avatar.png"}
                      className="rounded-full w-10 h-10"
                    />
                  </Avatar>
                </Link>

                {/* User Details */}
                <div className="flex flex-col w-full">
                  <Link
                    href={`/profile/${user.username}`}
                    className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
                  >
                    {user.username}
                  </Link>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    @{user.username}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {user._count.followers} followers
                  </p>
                </div>
              </div>

              {/* Follow Button (Full Width) */}
              <FollowButton userId={user.id} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
