import User from "@/lib/models/User";
import connect from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connect();
        const users = await User.find();

        if (!users) {
            return NextResponse.json(
                { error: "Error in Fetching users" },
                { status: 400 }
            );
        }

        return NextResponse.json({ users: users.length }, { status: 200 });
    } catch (error) {
        console.error("Fetch Event Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}