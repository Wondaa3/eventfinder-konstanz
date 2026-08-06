type ApiOptions = RequestInit & { token?: string | null };

// Kleiner fetch-Wrapper (VL 13): setzt die Header, hängt das Token an
// und wirft bei einer Fehlerantwort eine Exception mit der Meldung des Backends.
export async function apiFetch<T>(path: string, { token, ...options }: ApiOptions = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
