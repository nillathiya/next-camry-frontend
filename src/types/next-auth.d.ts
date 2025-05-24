// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string | null;
      name: string | null;
      backendToken: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
    token: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string | null;
    email: string;
    name: string | null;
    backendToken: string;
    role: string;
  }
}
