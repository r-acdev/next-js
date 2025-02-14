import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

const userCredentials = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        authorize: async (credentials) => {
            console.log("credentials :>> ", credentials);

        const parseCredentials = userCredentials.safeParse(credentials);

        if (!parseCredentials.success) {
          console.log("Invalid Credentials");
          return null;
        }

        const { email, password } = parseCredentials.data;

        try {
          const login = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            headers: {
              "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ email, password })
          });

          if (login.status !== 200) {
            console.log("login.statu :>> ", login.status);
            return null;
          }
          const user = await login.json();

          console.log("user :>> ", user);

          return user;
        } catch (error) {
          console.log("error  :>> ", error);
          return null;
        }
    }
    })
  ],
})