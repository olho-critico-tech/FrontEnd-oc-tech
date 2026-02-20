import { auth } from "@/lib/firebase";
import { getStoredToken } from "@/lib/token";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type ApiErrorPayload = {
  message?: string;
  error?: string;
  mensagem?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Authorization")) {
    const storedToken = getStoredToken();
    if (storedToken) {
      headers.set("Authorization", `Bearer ${storedToken}`);
    } else if (auth.currentUser) {
      const idToken = await auth.currentUser.getIdToken();
      headers.set("Authorization", `Bearer ${idToken}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let message = "Erro ao comunicar com o servidor.";
    if (contentType.includes("application/json")) {
      const data = (await response.json()) as ApiErrorPayload;
      message = data.message || data.mensagem || data.error || message;
    } else {
      const text = await response.text();
      if (text) message = text;
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

export const api = {
  get<T>(path: string) {
    return request<T>(path, { method: "GET" });
  },
  post<T>(path: string, body?: unknown) {
    const options: RequestInit = { method: "POST" };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }
    return request<T>(path, options);
  },
};

export async function downloadWithCredentials(path: string, filename: string) {
  const headers = new Headers();
  const storedToken = getStoredToken();
  if (storedToken) {
    headers.set("Authorization", `Bearer ${storedToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Erro ao baixar o arquivo.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
