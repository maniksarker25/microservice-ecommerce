import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const port = process.env.PORT || 4002;
const serviceName = process.env.SERVICE_NAME || "Inventory-Service";

// routes

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal service error" });
});
