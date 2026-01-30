import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a password reset link",
      })
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour

    // Store token (upsert to handle existing tokens)
    await prisma.verificationToken.upsert({
      where: {
        identifier_token: {
          identifier: email.toLowerCase(),
          token: token,
        },
      },
      update: {
        token,
        expires,
      },
      create: {
        identifier: email.toLowerCase(),
        token,
        expires,
      },
    })

    // In production, send email here
    // For now, log the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`
    console.log("===========================================")
    console.log("PASSWORD RESET LINK (would be emailed):")
    console.log(resetUrl)
    console.log("===========================================")

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a password reset link",
      // Remove this in production - only for development
      ...(process.env.NODE_ENV === "development" && { resetUrl }),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
