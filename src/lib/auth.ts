import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isCorrect) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.refreshedAt = Date.now();
      }
      const shouldRefresh =
        trigger === "update" ||
        !token.username ||
        !token.refreshedAt ||
        Date.now() - (token.refreshedAt as number) > 5 * 60 * 1000;
      if (token.id && shouldRefresh) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { username: true, name: true, image: true },
        });
        if (dbUser) {
          token.username = dbUser.username;
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.refreshedAt = Date.now();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
