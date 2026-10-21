import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import type { ErrorResponse } from "../types/api";
import type { AuthPayload } from "../types/auth";

// jwt.verify() devolve `string | jwt.JwtPayload`, e JwtPayload aceita
// qualquer campo. Este "type guard" confere em tempo de execução que o
// token tem o formato que nós assinamos. Se der true, o TS passa a
// tratar o valor como AuthPayload.
function isAuthPayload(value: unknown): value is AuthPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "email" in value &&
    typeof value.email === "string" &&
    "id" in value &&
    typeof value.id === "string"
  );
}

// O front envia o token puro no header Authorization (sem "Bearer").
export function auth(
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: "Token not provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!isAuthPayload(decoded)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
