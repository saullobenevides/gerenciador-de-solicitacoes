import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

import { DefaultSession, DefaultUser } from "next-auth"; // Ensure these are present
import { DefaultJWT } from "next-auth/jwt"; // Correctly import DefaultJWT

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      companyId: string;
      departmentId?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    companyId: string;
    departmentId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT { // Extend DefaultJWT
    // id is part of DefaultJWT
    role: string;
    companyId: string;
    departmentId?: string | null;
  }
}