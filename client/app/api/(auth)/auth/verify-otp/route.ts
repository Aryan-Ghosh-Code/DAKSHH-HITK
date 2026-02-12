import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import User from "@/lib/models/User";
import { sendWelcomeEmail } from "@/lib/auth-mail";
import { hashOtp } from "@/lib/otp";

interface VerifyOtpBody {
  email?: string;
  otp?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyOtpBody;
    const email = body.email?.toLowerCase().trim();
    const otp = body.otp?.trim();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Missing required fields: email, otp" },
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (user.provider === "google") {
      return NextResponse.json(
        { error: "This email is registered with Google. Please sign in with Google." },
        { status: 409 }
      );
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      return NextResponse.json(
        { error: "No active OTP found. Please request a new OTP." },
        { status: 400 }
      );
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "OTP has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    if (user.otpCode !== hashOtp(otp)) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const justVerified = !user.verified;
    user.emailVerified = new Date();
    user.verified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    if (justVerified) {
      await sendWelcomeEmail(email);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
