export interface IEnvironment {
  APP: {
    NAME?: string;
    PORT?: number;
    ENV?: string;
    CLIENT?: string;
  };
  CLIENT: {
    URL?: string;
  };
  DB: {
    URL: string;
  };
  EMAIL: {
    USER: string;
    PASSWORD: string;
  };
  JWT: {
    ACCESS_KEY: string;
    REFRESH_KEY: string;
  };
  JWT_EXPIRES_IN: {
    ACCESS: string;
    REFRESH: string;
  };
  STORAGE: {
    AZURE_CONTAINER_NAME?: string;
    AZURE_STORAGE_ACCOUNT_NAME?: string;
    AZURE_STORAGE_KEY?: string;
  };
  PAYSTACK: {
    PAYSTACK_SECRET_KEY: string;
  };
}
