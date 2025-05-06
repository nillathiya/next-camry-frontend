import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials provider called:", credentials); // Debug
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
              credentials: "include",
            }
          );
          const data = await response.json();
          console.log("Credentials provider response:", data); // Debug
          if (!response.ok) {
            throw new Error(data.message || "Authentication failed");
          }
          return {
            id: data.data.user._id,
            username: data.data.username,
            email: data.data.user.email || null,
            name: data.data.user.name || null,
            token: data.data.token, // backendToken
            role: data.data.user.role || "User",
          };
        } catch (error) {
          console.error("Credentials provider error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "impersonate",
      name: "Impersonate",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        console.log("Impersonate provider called:", credentials); // Debug
        if (!credentials?.token) {
          throw new Error("Token are required");
        }
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: credentials.token,
              }),
              credentials: "include",
            }
          );
          const data = await response.json();
          console.log("Impersonate provider response:", data); // Debug
          if (!response.ok) {
            throw new Error(data.message || "Invalid impersonation token");
          }
          return {
            id: data.data.user._id,
            username: data.data.username,
            email: data.data.user.email || null,
            name: data.data.user.name || null,
            token: credentials.token, // backendToken
            role: data.data.user.role || "user",
          };
        } catch (error) {
          console.error("Impersonate provider error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "siwe",
      name: "Sign-In with Ethereum",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        console.log("SIWE provider called:", credentials); // Debug
        if (!credentials?.message || !credentials?.signature) {
          throw new Error("Message and signature are required");
        }
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/siwe`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: credentials.message,
                signature: credentials.signature,
              }),
              credentials: "include",
            }
          );
          const data = await response.json();
          console.log("SIWE provider response:", data); // Debug
          if (!response.ok) {
            throw new Error(data.message || "SIWE authentication failed");
          }
          return {
            id: data.data.user._id || data.data.user.walletAddress,
            username: data.data.username || data.data.user.walletAddress,
            email: data.data.user.email || null,
            name: data.data.user.name || null,
            token: data.data.token, // backendToken
            role: data.data.user.role || "user",
          };
        } catch (error) {
          console.error("SIWE provider error:", error);
          return null;
        }
      },
    }),
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username ?? "";
        token.email = user.email ?? "";
        token.name = user.name ?? "";
        token.backendToken = user.token;
        token.role = user.role || "user";
        console.log("JWT callback:", { token, user }); // Debug
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
        session.user.backendToken = token.backendToken as string;
        session.user.role = token.role as string;
        console.log("Session callback:", { session, token }); // Debug
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl }); // Debug
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode for detailed logs
};
