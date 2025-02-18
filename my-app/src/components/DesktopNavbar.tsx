import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import { BellIcon, HomeIcon, User, UserIcon } from "lucide-react";

async function DesktopNavbar() {
  const user = await currentUser();
  console.log("user here is ", user);

  return (
    <div className="hidden md:flex items-center space-x-5">
      <Button variant={"ghost"} className="flex items-center gap-2" asChild>
        <Link href={"/"}>
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      {user ? (
        <>
          <Button variant={"ghost"} className="flex items-center gap-2" asChild>
            <Link href={"/notifications"}>
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
          <Button variant={"ghost"} className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.username ??
                user.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <>
          <SignInButton mode="modal">
            <Button variant={"secondary"}>Sign In</Button>
          </SignInButton>
        </>
      )}
      <ModeToggle />
    </div>
  );
}

export default DesktopNavbar;
