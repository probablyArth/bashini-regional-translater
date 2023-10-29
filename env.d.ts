declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      ULCA_API_KEY: string;
      ULCA_USER_ID: string;
    }
  }
}

export {};
