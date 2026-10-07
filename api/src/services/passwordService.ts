import bcrypt from 'bcrypt'

const BCRYPT_ROUNDS = 10

export async function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, BCRYPT_ROUNDS)
}

export async function comparePassword(plainTextPassword: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, passwordHash)
}
