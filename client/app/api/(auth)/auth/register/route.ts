import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connect from "@/lib/mongoose";
import User from "@/lib/models/User";
import { registerApiSchema } from "@/lib/validations/auth";

function humanizeZodMessage(msg: string, field: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("expected string") && lower.includes("undefined"))
    return `${field} is required`;
  if (lower.includes("invalid email")) return "Please enter a valid email address";
  if (lower.includes("at least 3")) return "Username must be at least 3 characters";
  if (lower.includes("at least 8")) return "Password must be at least 8 characters";
  return msg;
}

function getValidationMessage(error: { flatten: () => { fieldErrors: Record<string, string[]> } }): string {
  const { fieldErrors } = error.flatten();
  const entries = Object.entries(fieldErrors).filter(([, msgs]) => msgs.length > 0);
  if (entries.length === 0) return "Invalid input. Please check your details and try again.";
  const [field, msgs] = entries[0];
  const raw = msgs[0];
  if (field === "_root") return raw ?? "Invalid input";
  const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);
  return humanizeZodMessage(raw ?? "Invalid value", fieldLabel);
}

export async function POST(request: Request) {
  const log = (msg: string, data?: unknown) => {
    console.log(`[register] ${msg}`, data !== undefined ? JSON.stringify(data) : "");
  };

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      log("parse_error", { message: "Request body is not valid JSON" });
      return NextResponse.json(
        { error: "Invalid request. Please try again." },
        { status: 400 }
      );
    }

    if (body === null || typeof body !== "object") {
      log("invalid_body", { type: typeof body });
      return NextResponse.json(
        { error: "Invalid request. Please provide username, email, and password." },
        { status: 400 }
      );
    }

    log("request_received", {
      keys: Object.keys(body as object),
      hasUsername: "username" in (body as object),
      hasEmail: "email" in (body as object),
      hasPassword: "password" in (body as object),
    });

    const parsed = registerApiSchema.safeParse(body);

    if (!parsed.success) {
      const message = getValidationMessage(parsed.error);
      log("validation_failed", {
        message,
        issues: parsed.error.issues,
        received: body,
      });
      return NextResponse.json(
        { error: message, fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { username, email, password } = parsed.data;

    await connect();

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      log("duplicate_email", { email: email.toLowerCase() });
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const existingUsername = await User.findOne({
      username: new RegExp(`^${username}$`, "i"),
    });
    if (existingUsername) {
      log("duplicate_username", { username });
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      avatar: Math.floor(Math.random() * 10) + 1,
    });

    log("success", { email: email.toLowerCase() });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[register] unhandled_error", { message, stack });
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
