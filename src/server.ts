/**
 * Server Entry Point
 *
 * This file is responsible for starting the server, connecting to the database,
 * and handling graceful shutdowns. It serves as the main entry point for the application.
 */

import app from "./app";
import { closeDbConnection, connectDb } from "./common/config/database";
import { ENVIRONMENT } from "./common/config/environment";

/**
 * Starts the server and initializes the database connection.
 * @async
 * @throws Will exit the process if server start-up fails.
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to the database
    await connectDb();

    // Start the Express server
    app.listen(ENVIRONMENT.APP.PORT, () => {
      console.log(
        `=> ${ENVIRONMENT.APP.NAME} is running on port ${ENVIRONMENT.APP.PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit with a failure code
  }
};

// Initialize the server
startServer();

/**
 * Graceful Shutdown Handler
 *
 * This event listener catches SIGINT signals (e.g., from Ctrl+C)
 * and performs a graceful shutdown of the server.
 */
process.on("SIGINT", async () => {
  console.log("Initiating graceful shutdown...");

  closeDbConnection();

  console.log("Shutdown complete. Exiting process.");
  process.exit(0); // Exit with a success code
});
