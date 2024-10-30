// database.ts

import mongoose from "mongoose";
import { ENVIRONMENT } from "./environment";
/**
 * Establishes a connection to the MongoDB database.
 * @returns A promise that resolves when the connection is established.
 */
export const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(ENVIRONMENT.DB.URL);
    console.log("Database Connection Successful");
  } catch (error) {
    console.error("Database Connection Failed", error);
    process.exit(1); // Exit the process with failure
  }
};

/**
 * Closes the MongoDB connection.
 * This function can be useful for graceful shutdowns.
 */
export const closeDbConnection = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("Database Connection Closed");
  } catch (error) {
    console.error("Error Closing Database Connection", error);
  }
};
