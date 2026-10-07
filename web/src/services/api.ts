import type { LoginCredentials } from '@/types/user/Auth'
import type { PublicUser, RegistrationDetails } from '@/types/user/User'

/**
 * The only place in the frontend that calls the API. Pages call functions
 * from here, keeping the API URL in one place.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api'

/** Error returned by the API with a message that can be shown to the user. */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(BASE_URL + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    cache: 'no-store',
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    // The API returns { erro: "..." }; show its message when available.
    throw new ApiError(body?.erro ?? 'Could not reach the API.', response.status)
  }

  return body as T
}

type ApiUser = {
  id: string
  nome: string
  email: string
  dtCriacao: string
}

function toPublicUser(user: ApiUser): PublicUser {
  return {
    id: user.id,
    name: user.nome,
    email: user.email,
    createdAt: user.dtCriacao,
  }
}

export async function registerUser(details: RegistrationDetails): Promise<PublicUser> {
  const user = await request<ApiUser>('/usuarios', {
    method: 'POST',
    body: JSON.stringify({
      nome: details.name,
      email: details.email,
      senha: details.password,
    }),
  })
  return toPublicUser(user)
}

export async function authenticateUser(credentials: LoginCredentials): Promise<PublicUser> {
  const user = await request<ApiUser>('/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email,
      senha: credentials.password,
    }),
  })
  return toPublicUser(user)
}

type ApiHealth = {
  status: 'ok' | 'degradado'
  api: 'ok'
  banco: 'conectado' | 'inacessivel'
}

export type ApiHealthStatus = {
  status: 'ok' | 'degraded'
  api: 'ok'
  database: 'connected' | 'inaccessible'
}

export async function getApiHealth(): Promise<ApiHealthStatus> {
  const health = await request<ApiHealth>('/saude')
  return {
    status: health.status === 'degradado' ? 'degraded' : 'ok',
    api: health.api,
    database: health.banco === 'conectado' ? 'connected' : 'inaccessible',
  }
}
