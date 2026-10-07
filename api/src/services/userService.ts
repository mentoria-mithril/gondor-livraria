import { Prisma } from '@prisma/client'
import { DomainError } from '../errors/DomainError.js'
import type { UserRegistrationInput } from '../schemas/userSchema.js'
import {
  createUserWithCart,
  findUserByEmail,
  type PublicUser,
} from '../repositories/userRepository.js'
import { hashPassword } from './passwordService.js'

type RegistrationDependencies = {
  findUserByEmail: typeof findUserByEmail
  createUserWithCart: typeof createUserWithCart
  hashPassword: typeof hashPassword
}

const defaultDependencies: RegistrationDependencies = {
  findUserByEmail,
  createUserWithCart,
  hashPassword,
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function isUniqueEmailConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export async function registerUser(
  input: UserRegistrationInput,
  dependencies: RegistrationDependencies = defaultDependencies,
): Promise<PublicUser> {
  const email = normalizeEmail(input.email)
  const existingUser = await dependencies.findUserByEmail(email)

  if (existingUser) {
    throw new DomainError('Email address is already registered.', 409)
  }

  const passwordHash = await dependencies.hashPassword(input.password)

  try {
    return await dependencies.createUserWithCart({
      name: input.name.trim(),
      email,
      passwordHash,
    })
  } catch (error) {
    if (isUniqueEmailConflict(error)) {
      throw new DomainError('Email address is already registered.', 409)
    }
    throw error
  }
}
