// Formato das respostas JSON da API.
// O front-end tem uma cópia destes tipos em Frontend/src/types/api.ts.

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

// Datas viram string ao passar por JSON.
export interface Customer {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
