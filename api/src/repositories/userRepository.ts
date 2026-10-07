import { Prisma } from '@prisma/client'
import { prisma } from './prisma.js'

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect

type StoredPublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect
}>

export type PublicUser = {
  id: string
  name: string
  email: string
  createdAt: Date
}

function toPublicUser(user: StoredPublicUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

export async function findUserByEmail(email: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: publicUserSelect,
  })

  return user ? toPublicUser(user) : null
}

export async function createUserWithCart(data: {
  name: string
  email: string
  passwordHash: string
}): Promise<PublicUser> {
  return prisma.$transaction(async (transaction) => {
    const user = await transaction.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
      },
      select: publicUserSelect,
    })

    await transaction.cart.create({
      data: { userId: user.id },
    })

    return toPublicUser(user)
  })
}
