// Chaves do localStorage num só lugar. O tipo StorageKey só aceita
// estes três valores, então um erro de digitação vira erro de compilação.
type StorageKey = "token" | "userEmail" | "userName";

export function getItem(key: StorageKey): string | null {
  return localStorage.getItem(key);
}

export function setItem(key: StorageKey, value: string): void {
  localStorage.setItem(key, value);
}

export function clearSession(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
}
