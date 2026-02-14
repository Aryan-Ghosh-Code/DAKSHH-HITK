import Event from "@/lib/models/Events";
import connect from "@/lib/mongoose";
import { EventProps } from "@/types/interface";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const events = (await Event.find()
      .select(
        "_id eventName category description banner clubs date time venue isTeamEvent membersPerTeam",
      )
      .lean()) as EventProps[] | null;

    if (!events) {
      return NextResponse.json(
        { error: "Error in fetching Events" },
        { status: 400 },
      );
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error("Fetch Event Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
