import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { v4 as uuidv4 } from "uuid";
import { db } from "./lib/db";
import { getUserByEmail } from "./lib/user";
import { headers } from "next/headers";
declare module "next-auth" {
  interface Session {
    user: {
      role: "USER" | "ADMIN";
      username: string;
      sessionToken?: string;
    } & DefaultSession["user"];
  }
  interface User {
    sessionToken?: string;
  }

  interface AdapterUser {
    sessionToken?: string;
  }
  interface JWT {
    role?: "USER" | "ADMIN";
    username?: string;
    userId?: string;
    sessionToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  events: {
    async linkAccount({ user, account }) {
      if (account.provider !== "credentials") {
        await db.user.update({
          where: {
            email: user.email as string,
          },
          data: {
            emailVerified: new Date(),
            username: user.email
              ?.split("@")[0]
              .toLowerCase()
              .replace(/[^a-z0-9]/g, ""),
            provider: account.provider,
          },
        });
      }
    },
    async signOut(message) {
      const token = (message as any).token;
      if (token?.sessionToken) {
        try {
          await db.deviceSession.delete({
            where: {
              sessionToken: token.sessionToken,
            },
          });
        } catch (error) {
          console.log("Failed to delete device session:", error);
        }
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const headersList = await headers();
      const sessionToken = uuidv4();
      const userAgent = headersList.get("user-agent") || "Unknown";
      const forwardedFor = headersList.get("x-forwarded-for") || "";
      const ip = forwardedFor.split(",")[0].trim() || "Unknown";
      if (account?.provider === "credentials") {
        const existingUser = await db.user.findUnique({
          where: {
            email: user.email as string,
          },
        });
        if (!existingUser || !existingUser.emailVerified) {
          return false;
        }
      }
      if (!user.id) {
        throw new Error("User ID is missing");
      }
      await db.deviceSession.create({
        data: {
          userId: user.id,
          sessionToken,
          userAgent,
          ip,
          createdAt: new Date(),
          lastUsed: new Date(),
        },
      });
      return true;
    },
    async session({ session, token }) {
      if (token.sessionToken) {
        session.user.sessionToken = token.sessionToken as string;
      }
      if (token.sub && session.user) {
        session.user.id = token.userId as string;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "USER" | "ADMIN";
      }
      if (token.username && session.user) {
        session.user.username = token.username as string;
      }
      if (token.userId && session.user) {
        session.user.id = token.userId as string;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sessionToken && token.userId) {
        const deviceSession = await db.deviceSession.findFirst({
          where: { userId: token.userId },
          orderBy: { createdAt: "desc" },
        });
        if (deviceSession) {
          token.sessionToken = deviceSession.sessionToken;
        }
      }
      if (!token.sub) {
        return token;
      }
      if (!token.email) {
        return token;
      }
      const existingUser = await getUserByEmail(token.email);
      if (!existingUser) {
        return token;
      }
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.picture = existingUser.image;
      token.role = existingUser.role;
      token.userId = existingUser.id;
      token.username = existingUser.username;
      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
