import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

/**
 * Extend JWT to store GitHub access token
 */
interface ExtendedToken extends JWT {
  accessToken?: string;
}

/**
 * Extend session so server components & API routes
 * can access the GitHub access token
 */
export interface ExtendedSession extends Session {
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  // 🔒 DEBUG UIT — secrets mogen nooit in logs
  debug: false,

  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,

      /**
       * Explicit authorization params
       * Required for write actions (comments, labels, etc.)
       */
      authorization: {
        params: {
          scope: "repo read:user",
        },
      },
    }),
  ],

  callbacks: {
    /**
     * Runs on sign-in and whenever a JWT is created/updated
     */
    async jwt({ token, account }) {
      const extendedToken: ExtendedToken = { ...token };

      // On initial sign-in, GitHub provides an access token
      if (account?.access_token) {
        extendedToken.accessToken = account.access_token;
      }

      return extendedToken;
    },

    /**
     * Make access token available on the session object
     */
    async session({ session, token }) {
      const extendedSession: ExtendedSession = {
        ...session,
        accessToken: (token as ExtendedToken).accessToken,
      };

      return extendedSession;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
