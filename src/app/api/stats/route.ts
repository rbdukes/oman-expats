import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get real counts from database
    const [
      totalUsers,
      totalThreads,
      totalPosts,
      totalClassifieds,
    ] = await Promise.all([
      db.user.count({ where: { status: "active" } }),
      db.thread.count({ where: { status: "published" } }),
      db.post.count({ where: { status: "published" } }),
      db.classified.count({ where: { status: "active" } }),
    ]);

    // Get unique countries (nationalities)
    const nationalities = await db.user.findMany({
      where: { 
        nationality: { not: null },
        status: "active",
      },
      select: { nationality: true },
      distinct: ["nationality"],
    });
    const totalCountries = nationalities.length;

    // Get posts today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const postsToday = await db.post.count({
      where: {
        status: "published",
        createdAt: { gte: today },
      },
    });

    // Get threads today
    const threadsToday = await db.thread.count({
      where: {
        status: "published",
        createdAt: { gte: today },
      },
    });

    // Get users registered today
    const usersToday = await db.user.count({
      where: {
        status: "active",
        createdAt: { gte: today },
      },
    });

    return NextResponse.json({
      members: totalUsers,
      discussions: totalThreads,
      posts: totalPosts,
      countries: totalCountries,
      dailyPosts: postsToday,
      dailyThreads: threadsToday,
      dailyMembers: usersToday,
      classifieds: totalClassifieds,
    });
  } catch (error) {
    console.error("Get homepage stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
