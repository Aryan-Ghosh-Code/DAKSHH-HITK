import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import EventResult from "@/lib/models/EventResult";
import Event from "@/lib/models/Events";
import Team from "@/lib/models/Team";
import Registration from "@/lib/models/Registrations";
import { getAdminSession } from "@/lib/admin-session";

function canAccessResults(
  session: { role: string; permissions: string[]; isMaster?: boolean } | null
): boolean {
  if (!session) return false;
  if (session.isMaster || session.role === "master") return true;
  if (session.role === "admin") return true;
  return false;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await getAdminSession();
  if (!session || !canAccessResults(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await params;

  try {
    await connect();

    const [result, teams, soloRegs] = await Promise.all([
      EventResult.findOne({ eventId }).lean(),
      Team.find({ eventId })
        .populate("team", "username fullName email")
        .populate("teamLeader", "username fullName email")
        .lean(),
      Registration.find({ eventId, isInTeam: false })
        .populate("participant", "username fullName email")
        .lean(),
    ]);

    const teamOptions = teams.map((t) => {
      const tAny = t as Record<string, unknown>;
      const members = (tAny.team as Array<Record<string, unknown>>) ?? [];
      const leader = tAny.teamLeader as Record<string, unknown> | null;
      return {
        teamId: String(tAny._id ?? ""),
        teamCode: tAny.teamCode ?? "",
        teamName: tAny.teamName ?? "",
        participants: members.map((m) => ({
          userId: String(m._id ?? ""),
          name: (m.fullName as string) || (m.username as string) || "",
          isLeader: String(m._id) === String(leader?._id ?? ""),
        })),
      };
    });

    const soloOptions = soloRegs.map((r) => {
      const rAny = r as Record<string, unknown>;
      const p = rAny.participant as Record<string, unknown> | null;
      return {
        registrationId: String(rAny._id ?? ""),
        participantId: p ? String(p._id ?? "") : String(rAny.participant ?? ""),
        name: p
          ? (p.fullName as string) || (p.username as string) || ""
          : "Unknown",
      };
    });

    return NextResponse.json({
      result: result
        ? {
            _id: String((result as Record<string, unknown>)._id ?? ""),
            eventId: String((result as Record<string, unknown>).eventId ?? ""),
            eventName: (result as Record<string, unknown>).eventName ?? "",
            eventBanner: (result as Record<string, unknown>).eventBanner ?? null,
            eventCategory: (result as Record<string, unknown>).eventCategory ?? null,
            entries: (result as Record<string, unknown>).entries ?? [],
            isPublished: (result as Record<string, unknown>).isPublished ?? false,
            publishedAt: (result as Record<string, unknown>).publishedAt ?? null,
            updatedAt: (result as Record<string, unknown>).updatedAt ?? null,
          }
        : null,
      teamOptions,
      soloOptions,
    });
  } catch (err) {
    console.error("Admin result get error:", err);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await getAdminSession();
  if (!session || !canAccessResults(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await params;

  try {
    const body = await req.json();
    const { entries, isPublished } = body as {
      entries: unknown[];
      isPublished: boolean;
    };

    await connect();

    const event = await Event.findById(eventId)
      .select("eventName banner category")
      .lean();
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const eAny = event as Record<string, unknown>;

    const updateData: Record<string, unknown> = {
      eventId,
      eventName: eAny.eventName ?? "",
      eventBanner: eAny.banner ?? null,
      eventCategory: eAny.category ?? null,
      entries,
      isPublished: Boolean(isPublished),
    };

    if (isPublished) {
      updateData.publishedAt = new Date();
    }

    const updated = await EventResult.findOneAndUpdate(
      { eventId },
      { $set: updateData },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({
      success: true,
      result: updated,
    });
  } catch (err) {
    console.error("Admin result save error:", err);
    return NextResponse.json(
      { error: "Failed to save result" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const session = await getAdminSession();
  if (!session || !canAccessResults(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await params;

  try {
    await connect();
    await EventResult.deleteOne({ eventId });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin result delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete result" },
      { status: 500 }
    );
  }
}
