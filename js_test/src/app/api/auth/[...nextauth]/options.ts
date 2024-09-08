import type { NextAuthOptions } from "next-auth";
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "Username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "Password"
                }
            } ,
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                      username: credentials?.username,
                    },
                    select: {
                      id: false,
                      username: true,
                      password: true
                    }
                  })
                
                if (user != null) {  
                    if (credentials?.username === user.username && credentials?.password === user.password) {
                        return {
                            username: credentials.username,
                            password: credentials.password
                        }
                    } else {
                        return null
                    }
                } else {
                    const res = await prisma.user.create({
                        data: {
                          username: credentials!.username,
                          password: credentials!.password,
                        },
                        select: {
                            id: false,
                            username: true,
                            password: true
                        }
                      })
                    if (res === null) {
                        return null
                    }
                    return {
                        username: credentials?.username,
                        password: credentials?.password
                    }
                }
            }
        })
    ]
}