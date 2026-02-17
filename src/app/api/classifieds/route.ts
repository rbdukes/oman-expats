import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status: "active" };
    
    if (category) {
      where.category = category;
    }
    
    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [classifieds, total] = await Promise.all([
      db.classified.findMany({
        where,
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
        take: limit,
        skip,
      }),
      db.classified.count({ where }),
    ]);

    return NextResponse.json({
      classifieds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get classifieds error:", error);
    return NextResponse.json(
      { error: "Failed to fetch classifieds" },
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
    const {
      title,
      description,
      price,
      currency,
      category,
      subcategory,
      location,
      contactName,
      contactPhone,
      contactEmail,
      images,
      isUrgent,
      expiresAt,
    } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + "-" + Date.now();

    const classified = await db.classified.create({
      data: {
        title,
        slug,
        description,
        price: price ? parseFloat(price) : null,
        currency: currency || "OMR",
        category,
        subcategory,
        location,
        contactName,
        contactPhone,
        contactEmail,
        images,
        authorId: user.id,
        isUrgent: isUrgent || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: "active",
      },
    });

    return NextResponse.json(classified);
  } catch (error) {
    console.error("Create classified error:", error);
    return NextResponse.json(
      { error: "Failed to create classified" },
      { status: 500 }
    );
  }
}
