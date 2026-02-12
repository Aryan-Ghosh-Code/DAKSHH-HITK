import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/auth-mail";

interface SendEmailBody {
  to?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendEmailBody;
    const to = body.to?.trim();

    if (!to) {
      return NextResponse.json(
        { error: "Missing required field: to" },
        { status: 400 }
      );
    }

    const { data, error } = await sendWelcomeEmail(to);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
