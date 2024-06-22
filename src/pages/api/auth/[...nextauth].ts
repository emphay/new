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

                const userWithPassword = await prisma.user.findUnique({
                    select: {
                        id: true,
                        email: true,
                        password: true,
                    },
                    where: {
                        username: credentials.username
                    }
                })
                if (userWithPassword) {
                    const compareResult = bcrypt.compareSync(credentials.password, userWithPassword.password);
                    if (compareResult) {
                        console.log('Passwords match! User authenticated.',);
                        return {
                            id: userWithPassword.id,
                            username: credentials?.username,
                            name: credentials?.username,
                            email: userWithPassword.email
                        }
                    } else {
                        console.log('Passwords do not match! Authentication failed.');
                        return null;
                    }

                } else return null;
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