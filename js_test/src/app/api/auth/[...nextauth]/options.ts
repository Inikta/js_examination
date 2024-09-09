import type { NextAuthOptions } from "next-auth";
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from "@prisma/client"
import {findByUsername, createUser} from "../../../bd/bd_operations.mjs"
import { error } from "console";

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
                var user = null

                let findPromise = findByUsername(credentials.username)
                
                findPromise
                    .then(
                        result => user = result,
                        onerror => null
                    )
                
                if (user != null) {  
                    if (credentials?.username === user.username && credentials?.password === user.password) {
                        return {
                            id: 1,
                            username: credentials?.username,
                            password: credentials?.password
                        }
                    } else {
                        return null
                    }
                } else {
                    let createPromise = createUser(credentials)

                    createPromise
                        .then(
                            result => {return user},
                            onerror => {return null}
                        )
                }

                return null
            }
        })
    ]
}