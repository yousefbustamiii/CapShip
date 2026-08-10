import { createSignedDownloadUrl } from "@/infrastructure/r2/signer";
import type { Env } from "@/env";

import type { DownloadUrlResponse } from "./downloads.types";

const FREE_BUNDLE_KEY = "capship-free.zip";
const SIGNED_URL_EXPIRES_SECONDS = 900;

export async function getFreeBundleUrl(env: Env): Promise<DownloadUrlResponse> {
  const downloadUrl = await createSignedDownloadUrl(
    env,
    FREE_BUNDLE_KEY,
    SIGNED_URL_EXPIRES_SECONDS,
  );

  return { tier: "free", downloadUrl, expiresInSeconds: SIGNED_URL_EXPIRES_SECONDS };
}
