// Dados que colocamos dentro do JWT no login.
export interface AuthPayload {
  email: string;
  id: string; // _id do usuário no MongoDB, como string
}

// Corpo esperado em /register e /login.
export interface Credentials {
  email: string;
  password: string;
}
