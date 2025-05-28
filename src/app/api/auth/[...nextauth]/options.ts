import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
  
  export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (
            credentials?.username === "admin" &&
            credentials?.password === "admin"
          ) {
            return { id: "1", name: "Admin", email: "admin@example.com", role: "admin" };
          }
          return null;
        }
      })
    ],
    session: {
      strategy: "jwt"
    }
  };