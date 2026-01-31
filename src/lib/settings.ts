import { getLocalStorageItem, setLocalStorageItem } from "@/lib/storage";

const TOKEN_KEY = "papertrail.jwt";
const API_BASE_URL_KEY = "papertrail.apiBaseUrl";

export function getStoredToken(): string {
  return (getLocalStorageItem(TOKEN_KEY) ?? "").trim();
}

export function setStoredToken(token: string) {
  setLocalStorageItem(TOKEN_KEY, token.trim() ? token.trim() : null);
}

export function getStoredApiBaseUrl(): string {
  return (getLocalStorageItem(API_BASE_URL_KEY) ?? "").trim();
}

export function setStoredApiBaseUrl(url: string) {
  const normalized = url.trim().replace(/\/+$/, "");
  setLocalStorageItem(API_BASE_URL_KEY, normalized ? normalized : null);
}

export function getEffectiveApiBaseUrl(): string {
  const fromStorage = getStoredApiBaseUrl();
  if (fromStorage) return fromStorage;
  const fromEnv = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return "http://localhost:8080";
}
