import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get latest classifieds with real data
    const classifieds = await db.classified.findMany({
      where: { status: "active" },
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
      },
      orderBy: [
        { isFeatured: "desc" },
        { isUrgent: "desc" },
        { createdAt: "desc" },
      ],
      take: 8,
    });

    return NextResponse.json(classifieds);
  } catch (error) {
    console.error("Get latest classifieds error:", error);
    return NextResponse.json(
      { error: "Failed to fetch classifieds" },
      { status: 500 }
    );
  }
}
