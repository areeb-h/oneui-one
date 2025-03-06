import NextAuth from "next-auth";
import Zitadel from "next-auth/providers/zitadel";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Zitadel({
      issuer: process.env.ZITADEL_ISSUER, // Keep only issuer
      clientId: process.env.ZITADEL_CLIENT_ID,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" }, // Use JWT for Edge compatibility
});
