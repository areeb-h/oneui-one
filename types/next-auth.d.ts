// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    idToken?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    idToken?: string;
  }
}