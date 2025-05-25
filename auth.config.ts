import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./schemas/LoginSchema"
import { getUserByEmail } from "./lib/user"
import bcryptjs from 'bcryptjs'
export default {
  providers: [
    GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
    async authorize(credentials){
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
            const { email, password} = validatedFields.data;
            const user = await getUserByEmail(email);
            if (!user || !user.password) {
                return null
            }
            const isCorrectPassword = await bcryptjs.compare(password, user.password)
            if (isCorrectPassword) {
                console.log(user)
                return user
            }else {
                return null;
            }
        }
        return null;
    }
  })],
} satisfies NextAuthConfig