import { api, ApiError } from "@/lib/api";

export type UserProfile = {
  id: string;
  nome?: string;
  email?: string;
  phone?: string;
  emailAtivado?: boolean;
};

type UserResponse = {
  usuario: UserProfile;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isUserResponse = (data: unknown): data is UserResponse => {
  if (!isRecord(data)) return false;
  const usuario = data.usuario;
  if (!isRecord(usuario)) return false;
  return typeof usuario.id === "string";
};

export async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const data = await api.get<UserResponse>("/users/me");
    if (!isUserResponse(data)) return null;
    return data.usuario;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    return null;
  }
}

