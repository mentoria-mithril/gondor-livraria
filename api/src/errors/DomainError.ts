/** An expected application error with an HTTP status code. */
export class DomainError extends Error {
  readonly status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'DomainError'
    this.status = status
  }
}
