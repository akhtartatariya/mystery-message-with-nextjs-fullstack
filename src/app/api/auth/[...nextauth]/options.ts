import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcryptjs from "bcryptjs"


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
                console.log(" credentials",credentials)
                await dbConnect()
                try {
                    const user = await User.findOne({
                        $or: [
                            {
                                email: credentials.identifier
                            },
                            {
                                username: credentials.identifier
                            }
                        ]
                    })
                    if (!user) {
                        throw new Error("Not user Found with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }
                    const isPasswordCorrect = await bcryptjs.compare(credentials.password, user.password)
                    if (!isPasswordCorrect) {
                        throw new Error("Check your Credentials")
                    }
                    return user

                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}