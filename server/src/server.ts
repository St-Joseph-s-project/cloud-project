import app from "./app.ts";
import { connectDB } from "./config/database.ts";

const PORT = process.env.PORT || 3000;

// --- DATABASE & SERVER START ---

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();