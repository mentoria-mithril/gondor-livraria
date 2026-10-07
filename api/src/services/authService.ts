import { Prisma } from '@prisma/client'
import { DomainError } from '../errors/DomainError.js'
import type { LoginInput } from '../schemas/authSchema.js'
import type { PublicUser } from '../repositories/userRepository.js'
import { findUserForAuthentication } from '../repositories/authRepository.js'
import { comparePassword } from './passwordService.js'

type LoginDependencies = {
  findUserForAuthentication: typeof findUserForAuthentication
  comparePassword: typeof comparePassword
}

const defaultDependencies: LoginDependencies = {
  findUserForAuthentication,
  comparePassword,
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export async function authenticateUser(
  input: LoginInput,
  dependencies: LoginDependencies = defaultDependencies,
): Promise<PublicUser> {
  const email = normalizeEmail(input.email)
  const user = await dependencies.findUserForAuthentication(email)

  if (!user) {
    throw new DomainError('Invalid email or password.', 401)
  }

  const passwordIsCorrect = await dependencies.comparePassword(input.password, user.password)
  if (!passwordIsCorrect) {
    throw new DomainError('Invalid email or password.', 401)
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}
