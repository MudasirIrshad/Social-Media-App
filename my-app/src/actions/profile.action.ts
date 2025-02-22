"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

export async function getProfileByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        location: true,
        website: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        content: true,
        image: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        comment: {
          // Now includes comments
          select: {
            id: true,
            content: true, // Include comment content
            createdAt: true,
            author: {
              // Includes author details for each comment
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            comment: true,
            like: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching user posts for profile:", error);
    throw new Error("Error fetching user posts for profile: ");
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const website = formData.get("website") as string;
    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        name,
        bio,
        location,
        website,
      },
    });
    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Error updating user profile");
  }
}

export async function isFollowing(targetedUserId: string) {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) return false;
    const follow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetedUserId,
        },
      },
    });
    return !!follow;
  } catch (error) {
    console.error("Error checking if user is following:", error);
    throw new Error("Error checking if user is following");
  }
}
