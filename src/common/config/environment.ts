import dotenv from "dotenv";
import { IEnvironment } from "../interfaces/environment";

dotenv.config();

export const ENVIRONMENT: IEnvironment = {
  APP: {
    NAME: process.env.APP_NAME,
    PORT: parseInt(process.env.PORT || "2024"),
    ENV: process.env.NODE_ENV,
    CLIENT: process.env.CLIENT,
  },
  CLIENT: {
    URL: process.env.CLIENT_URL!,
  },
  DB: {
    URL: process.env.DB_URL!,
  },
  EMAIL: {
    USER: process.env.USER!,
    PASSWORD: process.env.PASSWORD!,
  },
  JWT: {
    REFRESH_KEY: process.env.REFRESH_JWT_KEY!,
    ACCESS_KEY: process.env.ACCESS_JWT_KEY!,
  },
  JWT_EXPIRES_IN: {
    REFRESH: process.env.REFRESH_JWT_EXPIRES_IN!,
    ACCESS: process.env.ACCESS_JWT_EXPIRES_IN!,
  },
  STORAGE: {
    AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME!,
    // AZURE_STORAGE_CONNECTION_STRING:
    //   process.env.AZURE_STORAGE_CONNECTION_STRING!,
    AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME!,
    AZURE_STORAGE_KEY: process.env.AZURE_STORAGE_KEY!,
  },
  PAYSTACK: {
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY!,
  },
};
