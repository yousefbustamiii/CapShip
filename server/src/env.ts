export interface Env {
  DB: D1Database;
  R2: R2Bucket;
  ENVIRONMENT: "development" | "production";
  R2_ACCOUNT_ID: string;
  R2_BUCKET: string;
  POLAR_ORGANIZATION_ID: string;
  RESEND_FROM_EMAIL: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  POLAR_ACCESS_TOKEN: string;
  POLAR_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  ADMIN_TOKEN: string;
}
