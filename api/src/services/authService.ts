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


export async function authenticateUser(
  input: LoginInput,
  dependencies: LoginDependencies = defaultDependencies,
): Promise<PublicUser> {
  const user = await dependencies.findUserForAuthentication(input.email)

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
