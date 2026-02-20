const TOKEN_KEY = "idToken";

const canUseStorage = () => {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
};

export function getStoredToken(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (!canUseStorage()) return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(TOKEN_KEY);
}
