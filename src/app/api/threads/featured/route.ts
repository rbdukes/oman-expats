import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get featured/pinned threads with real data
    const threads = await db.thread.findMany({
      where: { status: "published" },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: { posts: { where: { status: "published" } } },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
      take: 10,
    });

    return NextResponse.json(threads);
  } catch (error) {
    console.error("Get featured threads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}
