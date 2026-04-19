import { api } from './api'

export function saveToken(token: string): void {
  localStorage.setItem('pluginbase_token', token)
}

export function clearToken(): void {
  localStorage.removeItem('pluginbase_token')
}

export function getToken(): string | null {
  return localStorage.getItem('pluginbase_token')
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/v1/auth/logout', {})
  } catch {
    // ignore
  } finally {
    clearToken()
  }
}
