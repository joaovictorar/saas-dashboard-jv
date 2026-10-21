import type { AuthPayload } from "./auth";

// "Declaration merging": adicionamos o campo `user` à interface Request
// que já existe no Express. Ele é opcional porque só existe depois que o
// middleware `auth` roda.
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};
