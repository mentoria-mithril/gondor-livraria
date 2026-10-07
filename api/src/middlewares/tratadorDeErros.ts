import type { NextFunction, Request, Response } from 'express'
import { DomainError } from '../errors/DomainError.js'
import { ZodError } from 'zod'

/** Formats application errors for HTTP responses. */
export function tratadorDeErros(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof DomainError) {
    res.status(error.status).json({ error: error.message })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Invalid request data.',
      fields: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
    return
  }

  console.error('[unhandled error]', error)
  res.status(500).json({ error: 'Internal server error.' })
}
