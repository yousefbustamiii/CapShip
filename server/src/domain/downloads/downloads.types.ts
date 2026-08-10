export type BundleTier = "free" | "pro";

export interface DownloadUrlResponse {
  tier: BundleTier;
  downloadUrl: string;
  expiresInSeconds: number;
}
