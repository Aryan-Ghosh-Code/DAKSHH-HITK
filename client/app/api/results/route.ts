import { NextResponse } from "next/server";
import connect from "@/lib/mongoose";
import EventResult from "@/lib/models/EventResult";
import SiteSettings from "@/lib/models/SiteSettings";

export async function GET() {
  try {
    await connect();

    const visibilitySetting = await SiteSettings.findOne({
      key: "resultsPageEnabled",
    }).lean();
    const isEnabled =
      visibilitySetting == null
        ? true
        : (visibilitySetting as Record<string, unknown>).value !== false;

    if (!isEnabled) {
      return NextResponse.json({ hidden: true, results: [] });
    }

    const results = await EventResult.find({ isPublished: true })
      .sort({ publishedAt: -1, updatedAt: -1 })
      .lean();

    return NextResponse.json(
      results.map((r) => {
        const rAny = r as Record<string, unknown>;
        return {
          eventId: String(rAny.eventId ?? ""),
          eventName: rAny.eventName ?? "",
          eventBanner: rAny.eventBanner ?? null,
          eventCategory: rAny.eventCategory ?? null,
          entries: rAny.entries ?? [],
          publishedAt: rAny.publishedAt ?? rAny.updatedAt ?? null,
        };
      })
    );
  } catch (err) {
    console.error("Public results fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
