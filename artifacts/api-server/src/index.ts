import { existsSync } from "node:fs";
import app from "./app";
import { logger } from "./lib/logger";

for (const envFile of [".env.local", ".env"]) {
  if (existsSync(envFile) && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(envFile);
  }
}

const DEFAULT_PORT = 8080;
const rawPort = process.env["PORT"];
const port = rawPort ? Number(rawPort) : DEFAULT_PORT;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
