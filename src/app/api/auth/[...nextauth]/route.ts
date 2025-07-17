// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from '@/backend/lib/mongodb';
import User, { UserDocument } from "@/backend/models/User";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@/backend/lib/config";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select('+password') as UserDocument | null;

        if (!user) throw new Error("No user found with that email.");

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Invalid credentials.");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name || user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email!;
        session.user.name = token.name!;
        session.user.role = token.role as "admin" | "user";
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: JWT_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
