import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connect from "@/lib/mongoose";
import User from "@/lib/models/User";
import { signInSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        await connect();

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user?.passwordHash) return null;

        const valid = await user.comparePassword(password);
        if (!valid) return null;

        let avatar = user.avatar;
        if (!avatar) {
          avatar = Math.floor(Math.random() * 10) + 1;
          await User.findByIdAndUpdate(user._id, { avatar });
        }

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          image: user.image ?? undefined,
          avatar,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/profile`;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/profile`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
        token.avatar = (user as { avatar?: number }).avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as number | undefined;
      }
      return session;
    },
  },
});
