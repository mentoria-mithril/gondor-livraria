import { z } from 'zod'

export const userRegistrationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().email('Invalid email address.').transform((email) => email.toLowerCase()),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>
