import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
//@ts-ignore
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [CredentialsProvider({
        name: 'Credentials',
        credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
            if (credentials) {
                const userWithPassword = await prisma.user.findUnique({
                    select: {
                        id: true,
                        FirstName: true,
                        LastName: true,
                        email: true,
                        password: true
                    },
                    where: {
                        username: credentials.username
                    }
                });
                if (userWithPassword) {
                    const compareResult = bcrypt.compareSync(credentials.password, userWithPassword.password);
                    if (compareResult) {
                        console.log('Passwords match! User authenticated.');
                        return {
                            id: userWithPassword.id,
                            username: credentials?.username,
                            FirstName: userWithPassword.FirstName,
                            LastName: userWithPassword.LastName,
                            email: userWithPassword.email
                        };
                    } else {
                        console.log('Passwords do not match! Authentication failed.');
                        return null;
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    })],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.FirstName = user.FirstName;
                token.LastName = user.LastName;
            }
            return token;
        },
        async session({ session, token }) {
         
            if (token) {
                session.id = token.sub;
                session.user.FirstName = token.FirstName;
                session.user.LastName = token.LastName;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    pages: {
        signIn: "/signin",
    }
};

export default NextAuth(authOptions);
