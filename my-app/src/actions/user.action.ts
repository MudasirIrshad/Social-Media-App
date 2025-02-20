"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!user || !userId) return;
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        // mudasirirshad47@gmail.com => mudasirirshad47 will be the username
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
    return dbUser;
  } catch (error) {
    console.error("Error syncing user:", error);
    throw error;
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("UnAuthenticated");
  const user = await getUserByClerkId(clerkId);
  if (!user) throw new Error("User not found in database");
  return user.id;
}

export async function getRandomUsers() {
  try {
    const myId = await getDbUserId();
    // get random users exluding ourselves and user that we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: myId } },
          {
            NOT: { followers: { some: { followerId: myId } } },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 5,
    });
    return randomUsers;
  } catch (error) {
    console.error("Error getting random users:", error);
    return [];
  }
}
export async function toggleFollow(targetuserId: string) {
  try {
    const myId = await getDbUserId();
    if (myId == targetuserId) throw new Error("you can't follow yourself");
    // if already followed than unfollow
    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: myId,
          followingId: targetuserId,
        },
      },
    });
    if (existingFollow) {
      //unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: myId,
            followingId: targetuserId,
          },
        },
      });
    } else {
      //follow
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: myId,
            followingId: targetuserId,
          },
        }),
        prisma.notification.create({
          data: {
            userId: targetuserId,
            type: "FOLLOW",
            creatorId: myId,
          },
        }),
      ]);
    }
    revalidatePath("/")
    return { success: true };
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { success: false };
  }
}
