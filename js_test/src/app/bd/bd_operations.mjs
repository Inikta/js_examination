import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export function findByUsername (username) {
    return new Promise(function(resolve, reject) {
        const user = prisma.user.findUnique({
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
            resolve({id: 1, username: user?.username, password: user?.password})
        } else {
            reject(null)
        }
    })
}

export function createUser (credentials) {
    return new Promise(function(resolve, reject) {
        const user = prisma.user.create({
            data: {
              username: credentials?.username,
              password: credentials?.username,
            }
          })
        resolve({id: 1, username: credentials?.username, password: credentials?.password})
        reject(null)
    })
}