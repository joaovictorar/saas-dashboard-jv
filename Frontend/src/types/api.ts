// Formato das respostas JSON da API.
// Espelha saas-app/backend/src/types/api.ts: se mudar lá, mude aqui.

export interface ErrorResponse {
  error: string;
}

export interface MessageResponse {
  message: string;
}

export interface LoginResponse {
  token: string;
}

export interface DashboardMetric {
  name: string;
  value: string;
}

export interface DashboardResponse {
  message: string;
  data: DashboardMetric[];
}

export interface Customer {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Credentials {
  email: string;
  password: string;
}
