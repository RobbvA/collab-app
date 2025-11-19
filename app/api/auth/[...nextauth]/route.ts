import NextAuth, { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

interface ExtendedToken extends JWT {
  accessToken?: string;
}

export interface ExtendedSession extends Session {
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  debug: true, // 🔹 tijdelijk aan voor meer logs
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const extendedToken: ExtendedToken = { ...token };

      if (account && account.access_token) {
        extendedToken.accessToken = account.access_token as string;
      }

      return extendedToken;
    },
    async session({ session, token }) {
      const extendedToken = token as ExtendedToken;

      const extendedSession: ExtendedSession = {
        ...session,
        accessToken: extendedToken.accessToken,
      };

      return extendedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
