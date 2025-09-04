import "reflect-metadata";
import { AppDataSource } from "./database";
import apiService from "./app";

const PORT = 3124;

const startServer = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connection established");
    }

    const server = apiService.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    return server;
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { startServer };
