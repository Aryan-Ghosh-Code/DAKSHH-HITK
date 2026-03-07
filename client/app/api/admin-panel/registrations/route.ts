import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import Registration from "@/lib/models/Registrations";
import Event from "@/lib/models/Events";
import User from "@/lib/models/User";
import { getAdminSession } from "@/lib/admin-session";

function canAccessRegistrations(
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

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session || !canAccessRegistrations(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") ?? "";
    const verifiedParam = searchParams.get("verified");
    const checkedInParam = searchParams.get("checkedIn");
    const search = searchParams.get("search")?.trim() ?? "";

    await connect();

    const query: Record<string, unknown> = {};

    if (eventId) {
      query.eventId = eventId;
    }

    if (verifiedParam === "true") query.verified = true;
    else if (verifiedParam === "false") query.verified = false;

    if (checkedInParam === "true") query.checkedIn = true;
    else if (checkedInParam === "false") query.checkedIn = false;

    let participantIds: string[] | null = null;
    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const users = await User.find({
        $or: [
          { email: searchRegex },
          { username: searchRegex },
          { fullName: searchRegex },
        ],
      })
        .select("_id")
        .lean();
      participantIds = users.map((u) => String((u as { _id?: unknown })._id ?? ""));
      if (participantIds.length === 0) {
        return NextResponse.json({ registrations: [], events: [] });
      }
      query.participant = { $in: participantIds };
    }

    const regs = await Registration.find(query)
      .populate(
        "participant",
        "username email fullName college phoneNumber avatar roles provider amongUsScore emailVerified verified stream isProfileComplete createdAt updatedAt"
      )
      .populate("eventId", "eventName")
      .populate("checkedInBy", "username email")
      .populate({
        path: "teamId",
        select: "teamCode teamName teamLeader team paymentStatus",
        populate: {
          path: "team",
          select: "username email fullName college phoneNumber avatar",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    const events = await Event.find({})
      .select("_id eventName minMembersPerTeam")
      .sort({ eventName: 1 })
      .lean();

    return NextResponse.json({
      registrations: regs.map((r) => {
        const rAny = r as Record<string, unknown>;
        const participant = rAny.participant as {
          _id?: unknown;
          username?: string;
          email?: string;
          fullName?: string;
          college?: string;
          phoneNumber?: string;
          avatar?: number;
          roles?: string[];
          provider?: string;
          amongUsScore?: number;
          emailVerified?: Date;
          verified?: boolean;
          stream?: string;
          isProfileComplete?: boolean;
          createdAt?: Date;
          updatedAt?: Date;
        } | null;
        const event = rAny.eventId as { _id?: unknown; eventName?: string } | null;
        const team = rAny.teamId as {
          teamCode?: string;
          teamName?: string;
          paymentStatus?: string;
          team?: Array<{ _id: unknown; username?: string; email?: string; fullName?: string; college?: string; phoneNumber?: string; avatar?: number }>;
          teamLeader?: unknown;
        } | null;
        const checkedInByUser = rAny.checkedInBy as { username?: string; email?: string } | null;
        const eventIdRaw = event?._id ?? rAny.eventId;
        return {
          id: String(rAny._id ?? ""),
          eventId: String(eventIdRaw ?? ""),
          eventName: event?.eventName ?? "",
          isInTeam: rAny.isInTeam ?? false,
          teamId: rAny.teamId ? String((rAny.teamId as { _id?: unknown })?._id ?? rAny.teamId) : null,
          teamCode: team?.teamCode ?? null,
          teamName: team?.teamName ?? null,
          teamPaymentStatus: team?.paymentStatus ?? null,
          teamMembers: team?.team?.map(m => ({
            id: String(m._id ?? ""),
            username: m.username ?? "",
            fullName: m.fullName ?? "",
            email: m.email ?? "",
            college: m.college ?? "",
            phoneNumber: m.phoneNumber ?? "",
            avatar: m.avatar ?? null,
            isLeader: String(m._id) === String((team.teamLeader as { _id?: unknown })?._id ?? team.teamLeader)
          })) ?? [],
          participantId: participant ? String(participant._id ?? "") : String(rAny.participant ?? ""),
          participantUsername: participant?.username ?? "",
          participantName: participant?.fullName || participant?.username || "",
          participantEmail: participant?.email ?? "",
          participantCollege: participant?.college ?? "",
          participantPhone: participant?.phoneNumber ?? "",
          participantAvatar: participant?.avatar ?? null,
          participantRoles: participant?.roles ?? [],
          participantProvider: participant?.provider ?? "",
          participantAmongUsScore: participant?.amongUsScore ?? 0,
          participantEmailVerified: participant?.emailVerified ?? null,
          participantVerified: participant?.verified ?? false,
          participantStream: participant?.stream ?? "",
          participantIsProfileComplete: participant?.isProfileComplete ?? false,
          participantCreatedAt: participant?.createdAt ?? null,
          participantUpdatedAt: participant?.updatedAt ?? null,
          verified: rAny.verified ?? false,
          checkedIn: rAny.checkedIn ?? false,
          checkedInAt: rAny.checkedInAt ?? null,
          checkedInBy: checkedInByUser ? (checkedInByUser.username || checkedInByUser.email || String(rAny.checkedInBy)) : null,
          foodServedCount: rAny.foodServedCount ?? 0,
          lastFoodServedAt: rAny.lastFoodServedAt ?? null,
          createdAt: rAny.createdAt,
          updatedAt: rAny.updatedAt,
        };
      }),
      events: events.map((e) => ({
        id: String((e as { _id?: unknown })._id ?? ""),
        eventName: (e as { eventName?: string }).eventName ?? "",
        minMembersPerTeam: (e as { minMembersPerTeam?: number }).minMembersPerTeam ?? 1,
      })),
    });
  } catch (err) {
    console.error("Admin registrations list error:", err);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
