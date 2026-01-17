import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

dotenv.config();

const app = express();

// security middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  handler: (req, res) => {
    res.status(429).json({ message: "Too many requests, please try again letter" });
  },
});

app.use("/api", limiter);

// request handler
app.use(morgan("dev"));
app.use(express.json());

//TODO: auth middleware

const PORT = process.env.PORT || 8081;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.listen(PORT, () => {
  console.log(`API gateway is running on port ${PORT}`);
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
