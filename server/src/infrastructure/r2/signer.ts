import { AwsV4Signer } from "aws4fetch";

import type { Env } from "@/env";

const DEFAULT_EXPIRES_SECONDS = 15 * 60;

export async function createSignedDownloadUrl(
  env: Env,
  objectKey: string,
  expiresIn = DEFAULT_EXPIRES_SECONDS,
): Promise<string> {
  const baseUrl = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET}/${objectKey}`;
  const urlWithExpiry = `${baseUrl}?X-Amz-Expires=${expiresIn}`;

  const signer = new AwsV4Signer({
    url: urlWithExpiry,
    method: "GET",
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: "s3",
    region: "auto",
    signQuery: true,
  });

  const signed = await signer.sign();
  return signed.url.toString();
}
