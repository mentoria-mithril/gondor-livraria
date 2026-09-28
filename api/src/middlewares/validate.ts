import type { RequestHandler } from 'express'
import type { ZodTypeAny } from 'zod'

export function validate<TSchema extends ZodTypeAny>(schema: TSchema): RequestHandler {
  return (req, _res, next) => {
    const resultado = schema.safeParse(req.body ?? {})

    if (!resultado.success) {
      next(resultado.error)
      return
    }

    req.body = resultado.data
    next()
  }
}
