const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.message ?? `Request failed with status ${res.status}`
    );
  }

  return json as T;
}

export const http = {
  get:  <T>(path: string)                        => request<T>(path),
  post: <T>(path: string, body?: unknown)        =>
    request<T>(path, {
      method: 'POST',
      body:   body !== undefined ? JSON.stringify(body) : undefined,
    }),
};