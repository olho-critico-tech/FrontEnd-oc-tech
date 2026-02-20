import { api, ApiError } from "@/lib/api";
import { clearStoredToken } from "@/lib/token";

type Usuario = {
  id: string;
  nome?: string;
  email?: string;
  phone?: string;
  emailAtivado?: boolean;
  expiresAt?: string;
};

export type SessionInfo = {
  usuario: Usuario;
};

const SESSION_ENDPOINTS = ["/auth/session", "/auth/me"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isSessionInfo = (data: unknown): data is SessionInfo => {
  if (!isRecord(data)) return false;
  const usuario = data.usuario;
  if (!isRecord(usuario)) return false;
  return typeof usuario.id === "string";
};

export async function fetchSession(): Promise<SessionInfo | null> {
  for (const path of SESSION_ENDPOINTS) {
    try {
      const data = await api.get<SessionInfo>(path);
      if (isSessionInfo(data)) return data;
      return null;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        if (path === "/auth/session") continue;
        return null;
      }
      return null;
    }
  }
  return null;
}

export async function requestLogout(): Promise<void> {
  clearStoredToken();
}
