import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import EventResult from "@/lib/models/EventResult";
import Event from "@/lib/models/Events";
import { getAdminSession } from "@/lib/admin-session";

function canAccessResults(
  session: { role: string; permissions: string[]; isMaster?: boolean } | null
): boolean {
  if (!session) return false;
  if (session.isMaster || session.role === "master") return true;
  if (session.role === "admin") return true;
  return false;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session || !canAccessResults(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connect();

    const [results, events] = await Promise.all([
      EventResult.find({}).sort({ updatedAt: -1 }).lean(),
      Event.find({}).select("_id eventName banner category isTeamEvent").sort({ eventName: 1 }).lean(),
    ]);

    return NextResponse.json({
      results: results.map((r) => {
        const rAny = r as Record<string, unknown>;
        return {
          _id: String(rAny._id ?? ""),
          eventId: String(rAny.eventId ?? ""),
          eventName: rAny.eventName ?? "",
          eventBanner: rAny.eventBanner ?? null,
          eventCategory: rAny.eventCategory ?? null,
          entries: rAny.entries ?? [],
          isPublished: rAny.isPublished ?? false,
          publishedAt: rAny.publishedAt ?? null,
          updatedAt: rAny.updatedAt ?? null,
        };
      }),
      events: events.map((e) => {
        const eAny = e as Record<string, unknown>;
        return {
          id: String(eAny._id ?? ""),
          eventName: eAny.eventName ?? "",
          banner: eAny.banner ?? null,
          category: eAny.category ?? null,
          isTeamEvent: eAny.isTeamEvent ?? false,
        };
      }),
    });
  } catch (err) {
    console.error("Admin results list error:", err);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
