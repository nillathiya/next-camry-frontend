// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      backendToken: string
      role: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    token: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    email: string
    name: string | null
    backendToken: string
    role: string
  }
}
