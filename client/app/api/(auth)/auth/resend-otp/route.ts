import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import User from "@/lib/models/User";
import { sendOtpEmail } from "@/lib/auth-mail";
import { generateOtp, hashOtp, otpExpiryDate } from "@/lib/otp";

interface ResendOtpBody {
  email?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResendOtpBody;
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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

    if (user.verified) {
      return NextResponse.json(
        { error: "Account is already verified. Please sign in." },
        { status: 409 }
      );
    }

    const otp = generateOtp();
    user.otpCode = hashOtp(otp);
    user.otpExpiresAt = otpExpiryDate(10);
    await user.save();

    await sendOtpEmail(email, otp);
    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch {
    return NextResponse.json(
      { error: "Failed to resend OTP. Please try again." },
      { status: 500 }
    );
  }
}
