import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { logger } from "./config/logger";
import { errorMiddleware } from "./middleware/error.middleware";
import { dutiesRouter } from "./routes/duties.routes";

dotenv.config();

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/duties", dutiesRouter);

  app.use(errorMiddleware);
  return app;
}

