import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { User } from "../models/User";
import type { ErrorResponse, LoginResponse, MessageResponse } from "../types/api";
import type { AuthPayload, Credentials } from "../types/auth";

export const authRouter = Router();

// req.body vem do cliente, então o TS não pode confiar no formato: tratamos
// como `unknown` e só usamos depois de checar que email e password são
// strings não vazias.
function isCredentials(body: unknown): body is Credentials {
  return (
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof body.email === "string" &&
    body.email !== "" &&
    "password" in body &&
    typeof body.password === "string" &&
    body.password !== ""
  );
}

// Request<Params, ResBody, ReqBody>: o 3º parâmetro tipa req.body.
// Response<T> faz res.json() só aceitar objetos do tipo T.
type CredentialsRequest = Request<Record<string, string>, unknown, unknown>;

authRouter.post(
  "/register",
  async (req: CredentialsRequest, res: Response<MessageResponse | ErrorResponse>) => {
    try {
      if (!isCredentials(req.body)) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(400).json({ error: "Email already registered" });
        return;
      }

      const hash = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        password: hash
      });

      await user.save();

      res.status(201).json({ message: "User saved in DB" });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

authRouter.post(
  "/login",
  async (req: CredentialsRequest, res: Response<LoginResponse | ErrorResponse>) => {
    try {
      if (!isCredentials(req.body)) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.status(400).json({ error: "User not found" });
        return;
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        res.status(400).json({ error: "Invalid password" });
        return;
      }

      const payload: AuthPayload = { email, id: user._id.toString() };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1d"
      });

      res.json({ token });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
