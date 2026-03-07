import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { generateJSON } from "@/lib/generate";

function canAccessMail(
  session: { role: string; permissions: string[]; isMaster?: boolean } | null
): boolean {
  if (!session) return false;
  if (session.isMaster || session.role === "master") return true;
  if (session.role === "admin") return true;
  if (session.role === "camsguy") return true;
  if (session.role === "imposter")
    return session.permissions.includes("registrations");
  return false;
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || !canAccessMail(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      details?: string;
      placeholders?: { key: string; desc: string }[];
      recipientCount?: number;
      hasTeamEventData?: boolean;
    };
    const details = body.details?.trim() ?? "";
    const placeholders = body.placeholders ?? [];

    const prompt = `You are an email template generator. You are given a prompt and you need to generate a template email with placeholders based on the prompt. You are working for Heritage Institute of Technology, Kolkata's Annual Techno-Management Fest of 2026 called Dakshh. The theme of the event is Among Us. The event is from 13th to 14th March 2026.
    Craft an email based on the following requirements:
    The prompt is: ${details}

    Placeholders you can use are: ${placeholders.map((p) => p.key).join(", ")}. Remember these placeholders are information about the recipient only. Not information about the event or Dakshh.
  
    Rules:
    - The template must contain ONLY the email body (not the subject line).
    - End the body with this exact sign-off:
      Best regards,
      Team Dakshh 2026,
      HITK
    - Use markdown format. Only use the placeholders provided, do not assume any information.
    - Do not mention the theme "Among Us" in the email. But you can use subtle references to it, like make the email theme "Among Us" related.
    - When you are mentioning a team, remember to also mention the event name and team code as well.

    Your output should be a JSON object with:
    - "subject": the email subject line
    - "template": the email body in markdown format (with the sign-off above)
    `;
    const schema = {
      type: "object" as const,
      properties: {
        subject: { type: "string" as const, description: "The email subject line" },
        template: { type: "string" as const, description: "The email body in markdown format" },
      },
      required: ["subject", "template"],
    };
    const result = await generateJSON<{ subject: string; template: string }>(prompt, schema);
    return NextResponse.json({ subject: result.subject, email: result.template });
  } catch (err) {
    console.error("Admin mail ai-draft error:", err);
    return NextResponse.json(
      { error: "Failed to generate draft" },
      { status: 500 }
    );
  }
}
