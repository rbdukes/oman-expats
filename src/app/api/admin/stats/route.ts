import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalThreads,
      totalPosts,
      totalClassifieds,
      pendingReports,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { status: "active" } }),
      db.user.count({ where: { status: "pending" } }),
      db.thread.count({ where: { status: "published" } }),
      db.post.count({ where: { status: "published" } }),
      db.classified.count({ where: { status: "active" } }),
      db.report.count({ where: { status: "pending" } }),
    ]);

    // Get new users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersThisWeek = await db.user.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    });

    // Get new threads in last 7 days
    const newThreadsThisWeek = await db.thread.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: "published",
      },
    });

    // Get user registrations by nationality (top 10)
    const usersByNationality = await db.user.groupBy({
      by: ["nationality"],
      _count: true,
      where: { nationality: { not: null } },
      orderBy: { _count: { nationality: "desc" } },
      take: 10,
    });

    // Get most active categories
    const activeCategories = await db.category.findMany({
      include: {
        _count: {
          select: { threads: true },
        },
      },
      where: { parentId: null },
      orderBy: { threads: { _count: "desc" } },
      take: 5,
    });

    return NextResponse.json({
      counts: {
        totalUsers,
        activeUsers,
        pendingUsers,
        totalThreads,
        totalPosts,
        totalClassifieds,
        pendingReports,
        newUsersThisWeek,
        newThreadsThisWeek,
      },
      usersByNationality: usersByNationality.filter((u) => u.nationality),
      activeCategories: activeCategories.map((c) => ({
        name: c.name,
        threads: c._count.threads,
      })),
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
