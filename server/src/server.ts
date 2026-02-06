import app from "./app.ts";
import { connectDB } from "./config/database.ts";

const PORT = process.env.PORT || 3000;

// --- DATABASE & SERVER START ---

const startServer = async () => {
  try {
    console.log("Starting server...");
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer().catch((error) => {
  console.error("Uncaught error in startServer:", error);
  process.exit(1);
});