import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import SiteSettings from "@/lib/models/SiteSettings";
import { getAdminSession } from "@/lib/admin-session";

const SETTINGS_KEY = "resultsPageEnabled";

function canAccessSettings(
  session: { role: string; permissions: string[]; isMaster?: boolean } | null
): boolean {
  if (!session) return false;
  if (session.isMaster || session.role === "master") return true;
  if (session.role === "admin") return true;
  return false;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session || !canAccessSettings(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connect();
    const setting = await SiteSettings.findOne({ key: SETTINGS_KEY }).lean();
    const enabled =
      setting == null ? true : (setting as Record<string, unknown>).value !== false;
    return NextResponse.json({ enabled });
  } catch (err) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ error: "Failed to fetch setting" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session || !canAccessSettings(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { enabled } = await req.json();
    if (typeof enabled !== "boolean") {
      return NextResponse.json({ error: "Invalid value" }, { status: 400 });
    }

    await connect();
    await SiteSettings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { key: SETTINGS_KEY, value: enabled },
      { upsert: true, new: true }
    );

    return NextResponse.json({ enabled });
  } catch (err) {
    console.error("Settings PUT error:", err);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
