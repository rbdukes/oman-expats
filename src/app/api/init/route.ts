import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "@node-rs/argon2";

// This endpoint initializes the database with essential data
export async function GET() {
  try {
    // Check if already initialized
    const existingCategories = await db.category.count();
    
    if (existingCategories > 0) {
      return NextResponse.json({ 
        message: "Database already initialized",
        categories: existingCategories 
      });
    }

    // Create categories
    const categories = [
      {
        name: "Moving to Oman",
        slug: "moving-to-oman",
        description: "Visa, residency, work permits & immigration",
        icon: "Home",
        color: "#C41E3A",
        order: 1,
      },
      {
        name: "Employment & Business",
        slug: "employment-business",
        description: "Jobs, business setup & networking",
        icon: "Briefcase",
        color: "#228B22",
        order: 2,
      },
      {
        name: "Housing & Real Estate",
        slug: "housing-real-estate",
        description: "Apartments, villas & property listings",
        icon: "Building",
        color: "#1E90FF",
        order: 3,
      },
      {
        name: "Transport & Driving",
        slug: "transport-driving",
        description: "Driving licenses, cars & public transport",
        icon: "Car",
        color: "#FFB800",
        order: 4,
      },
      {
        name: "Medical & Health",
        slug: "medical-health",
        description: "Hospitals, clinics & insurance providers",
        icon: "Heart",
        color: "#FF69B4",
        order: 5,
      },
      {
        name: "Family & Lifestyle",
        slug: "family-lifestyle",
        description: "Schools, activities & community events",
        icon: "Users",
        color: "#8A2BE2",
        order: 6,
      },
      {
        name: "Shopping & Services",
        slug: "shopping-services",
        description: "Supermarkets, furniture & domestic help",
        icon: "ShoppingCart",
        color: "#FF8C00",
        order: 7,
      },
      {
        name: "Classifieds",
        slug: "classifieds",
        description: "Buy, sell, jobs & services",
        icon: "Tag",
        color: "#20B2AA",
        order: 8,
      },
      {
        name: "News & Updates",
        slug: "news-updates",
        description: "Government updates & community alerts",
        icon: "Newspaper",
        color: "#4682B4",
        order: 9,
      },
      {
        name: "General Discussion",
        slug: "general-discussion",
        description: "Introductions, advice & off-topic",
        icon: "MessageSquare",
        color: "#708090",
        order: 10,
      },
      {
        name: "Guides & Knowledge Base",
        slug: "guides-knowledge-base",
        description: "Cost of living, banking & relocation guides",
        icon: "BookOpen",
        color: "#2F4F4F",
        order: 11,
      },
    ];

    for (const category of categories) {
      await db.category.create({ data: category });
    }

    // Create admin user
    const adminEmail = "admin@omanexpat.com";
    const adminPassword = "OmanExpat@2024!";
    const hashedPassword = await hash(adminPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await db.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        displayName: "Administrator",
        role: "admin",
        status: "active",
        emailVerified: true,
      },
    });

    // Create site settings
    const settings = [
      { key: "site_name", value: "Oman Expat" },
      { key: "site_description", value: "Your trusted community for expatriates living in or relocating to Oman" },
      { key: "contact_email", value: "info@omanexpat.com" },
    ];

    for (const setting of settings) {
      await db.setting.create({ data: setting });
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      categories: categories.length,
      adminCreated: true,
    });
  } catch (error) {
    console.error("Initialization error:", error);
    return NextResponse.json(
      { error: "Initialization failed", details: String(error) },
      { status: 500 }
    );
  }
}
