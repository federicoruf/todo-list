import { createApp } from "./app";
import { logger } from "./config/logger";
import { getPool } from "./config/db";

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

async function main() {
  // Ensure pool initializes early (and logs pool errors).
  getPool();

  const app = createApp();
  app.listen(port, () => {
    logger.info("server started", { port });
  });
}

void main();

