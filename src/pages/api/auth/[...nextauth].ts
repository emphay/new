import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
//@ts-ignore
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()
export const authOptions = {
    adapter: PrismaAdapter(prisma),
    // Configure one or more authentication providers
    providers: [CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        // id: "email-auth",
        name: 'Credentials',
        // type: 'credentials',

        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
            if (credentials) {
                bcrypt.hash(credentials.password, 10, async (err: any, hash: any) => {
                    if (err) {
                        return null;
                    }
                    const dbUser = await prisma.user.findUnique({
                        where: {
                            username: credentials?.username,
                            password: hash
                        }, select: {
                            email: true,
                            id: true,
                        }
                    })
                    if (dbUser) {
                        return {
                            id: dbUser.id,
                            name: credentials?.username,
                            email: dbUser.email
                        }
                    } else return null;
                })

            } else return null;
        }
    })],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    pages: {
        signIn: "/signin",
    }
}

export default NextAuth(authOptions)