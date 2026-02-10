import "dotenv/config";
import app from "./app.ts";
import { connectDB } from "./config/database.ts";
import logger from "./config/logger.ts";

const PORT = process.env.PORT || 3000;

// --- DATABASE & SERVER START ---

const startServer = async () => {
  try {
    logger.info("Starting server...");
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer().catch((error) => {
  logger.error("Uncaught error in startServer:", error);
  process.exit(1);
});
