import { redirect } from "next/navigation";
import { auth } from "@/auth";
import connect from "@/lib/mongoose";
import User from "@/lib/models/User";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth?callbackUrl=/profile");
  }

  await connect();

  const user = await User.findById(session.user.id)
    .select("username avatar email")
    .lean() as { username: string; avatar?: number; email: string } | null;

  if (!user) {
    redirect("/auth?callbackUrl=/profile");
  }

  return (
    <ProfileClient
      initialUsername={user.username}
      initialAvatar={user.avatar ?? null}
      initialEmail={user.email}
    />
  );
}
