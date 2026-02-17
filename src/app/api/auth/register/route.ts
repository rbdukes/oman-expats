import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, createSession, generateVerificationCode } from "@/lib/auth";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  nationality: z.string().optional(),
  currentLocation: z.string().optional(),
  profession: z.string().optional(),
  company: z.string().optional(),
  yearsInOman: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Generate verification code
    const verificationCode = await generateVerificationCode();

    // Create user
    const user = await db.user.create({
      data: {
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        displayName: `${validatedData.firstName} ${validatedData.lastName}`,
        nationality: validatedData.nationality,
        currentLocation: validatedData.currentLocation,
        profession: validatedData.profession,
        company: validatedData.company,
        yearsInOman: validatedData.yearsInOman,
        verificationCode,
        status: "pending",
        role: "member",
      },
    });

    // Create session
    await createSession(user.id);

    // In production, send verification email here
    console.log(`Verification code for ${user.email}: ${verificationCode}`);

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for verification code.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
