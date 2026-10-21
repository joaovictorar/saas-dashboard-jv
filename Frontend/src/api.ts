import type {
  Credentials,
  Customer,
  DashboardResponse,
  ErrorResponse,
  LoginResponse,
  MessageResponse
} from "./types/api";

// Em produção usa o back-end do Render; dá para trocar com VITE_API_URL no .env
const API = import.meta.env.VITE_API_URL ?? "https://saas-backend-q4qp.onrender.com";

function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  );
}

// Função genérica: quem chama diz qual tipo espera (request<LoginResponse>).
async function request<T>(path: string, init: RequestInit, fallbackError: string): Promise<T> {
  const res = await fetch(`${API}${path}`, init);

  // res.json() devolve `any`. Guardamos como `unknown` para o TS nos
  // obrigar a checar antes de usar.
  const data: unknown = await res.json();

  if (!res.ok) {
    throw new Error(isErrorResponse(data) && data.error ? data.error : fallbackError);
  }

  // Asserção consciente: confiamos que a nossa própria API respeita o
  // contrato de src/types/api.ts (não validamos campo a campo em runtime).
  return data as T;
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: token };
}

export function login(credentials: Credentials): Promise<LoginResponse> {
  return request<LoginResponse>("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  }, "Login failed");
}

export function register(credentials: Credentials): Promise<MessageResponse> {
  return request<MessageResponse>("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  }, "Register failed");
}

export function getDashboard(token: string): Promise<DashboardResponse> {
  return request<DashboardResponse>("/dashboard", {
    method: "GET",
    headers: authHeaders(token)
  }, "Failed to load dashboard");
}

export function getCustomers(token: string): Promise<Customer[]> {
  return request<Customer[]>("/customers", {
    method: "GET",
    headers: authHeaders(token)
  }, "Failed to load customers");
}
