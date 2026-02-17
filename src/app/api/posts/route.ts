import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: "published" };
    if (threadId) {
      where.threadId = threadId;
    }

    const posts = await db.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      take: limit,
      skip,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, threadId, parentId } = body;

    if (!content || !threadId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if thread exists and is not locked
    const thread = await db.thread.findUnique({
      where: { id: threadId },
      select: { id: true, isLocked: true },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    if (thread.isLocked && user.role !== "admin") {
      return NextResponse.json(
        { error: "Thread is locked" },
        { status: 403 }
      );
    }

    const post = await db.post.create({
      data: {
        content,
        authorId: user.id,
        threadId,
        parentId,
        status: "published",
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
