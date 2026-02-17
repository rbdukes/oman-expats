import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get all parent categories with real counts
    const categories = await db.category.findMany({
      where: { 
        parentId: null,
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { threads: { where: { status: "published" } } },
        },
      },
      orderBy: { order: "asc" },
    });

    // Get post counts for each category
    const categoriesWithPostCounts = await Promise.all(
      categories.map(async (category) => {
        const postCount = await db.post.count({
          where: {
            thread: { categoryId: category.id },
            status: "published",
          },
        });

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          color: category.color,
          subcategories: category.children,
          threads: category._count.threads,
          posts: postCount,
        };
      })
    );

    return NextResponse.json(categoriesWithPostCounts);
  } catch (error) {
    console.error("Get categories with stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
