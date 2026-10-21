import { MONGO_URI, PORT } from "./config/env";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth";
import { dashboardRouter } from "./routes/dashboard";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

mongoose.connect(MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("MongoDB conectado 🚀");
});

mongoose.connection.on("error", (err: Error) => {
  console.log("Erro no MongoDB:", err.message);
});

app.get("/", (_req, res) => {
  res.json({ message: "API running" });
});

app.use(authRouter);
app.use(dashboardRouter);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
