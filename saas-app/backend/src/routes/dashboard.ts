import { Router, type Request, type Response } from "express";
import { auth } from "../middleware/auth";
import { User } from "../models/User";
import type { Customer, DashboardResponse, ErrorResponse } from "../types/api";

export const dashboardRouter = Router();

// `auth` roda antes do handler e preenche req.user.
dashboardRouter.get(
  "/dashboard",
  auth,
  (req: Request, res: Response<DashboardResponse | ErrorResponse>) => {
    // Para o TS, req.user continua `AuthPayload | undefined` (ele não sabe
    // que o middleware rodou antes). Esta checagem faz o "narrowing".
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.json({
      message: "Welcome " + req.user.email,
      data: [
        { name: "Revenue", value: "$1200" },
        { name: "Users", value: "320" }
      ]
    });
  }
);

dashboardRouter.get(
  "/customers",
  auth,
  async (_req: Request, res: Response<Customer[] | ErrorResponse>) => {
    try {
      const users = await User.find().select("-password");

      // Montamos o objeto de resposta explicitamente para que ele bata
      // com o tipo Customer (ObjectId e Date viram string).
      const customers: Customer[] = users.map((user) => ({
        _id: user._id.toString(),
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }));

      res.json(customers);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
