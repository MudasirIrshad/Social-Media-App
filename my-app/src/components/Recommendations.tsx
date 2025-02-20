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
        <div className="space-y-4 ">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-2 items-center justify-between"
            >
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage
                      src={user.image ?? "/avatar.png"}
                      className="rounded-full w-12 h-12 mr-2"
                    />
                  </Avatar>
                </Link>
                <div>
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium cursor-pointer"
                  >
                    {user.username}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">
                    @{user._count.followers} followers
                  </p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
