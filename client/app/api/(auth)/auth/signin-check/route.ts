import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connect from "@/lib/mongoose";
import User from "@/lib/models/User";
import { signInSchema } from "@/lib/validations/auth";
import { sendOtpEmail } from "@/lib/auth-mail";
import { generateOtp, hashOtp, otpExpiryDate } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    await connect();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.provider === "google") {
      return NextResponse.json(
        {
          error:
            "This email is registered with Google. Please sign in using Google.",
          provider: "google",
        },
        { status: 409 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.verified) {
      const otp = generateOtp();
      user.otpCode = hashOtp(otp);
      user.otpExpiresAt = otpExpiryDate(10);
      await user.save();
      await sendOtpEmail(normalizedEmail, otp);

      return NextResponse.json(
        {
          requiresVerification: true,
          message: "Your email is not verified. A new OTP has been sent.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ canSignIn: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to process sign-in. Please try again." },
      { status: 500 }
    );
  }
}
