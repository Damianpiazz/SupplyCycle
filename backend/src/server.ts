import dotenv from "dotenv";
import app from "./app.js";
import { logger } from "./lib/logger.js";

dotenv.config();

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

app.listen(PORT, () => {
  logger.info({ port: PORT }, `Server listening on port ${PORT}`);
});