import { getDb } from "@/infrastructure/db/client";
import { createSignedDownloadUrl } from "@/infrastructure/r2/signer";
import type { Env } from "@/env";
import { Errors } from "@/shared/errors/http-error";
import { generateId } from "@/shared/utils/crypto";

import {
  findLicenseByKey,
  findLicenseByPolarId,
  insertLicense,
  logFailedRedemption,
  redeemLicense,
  revokeLicense,
} from "./licenses.repository";
import type { CreateLicensePayload, RedeemSuccessResponse } from "./licenses.types";

const PRO_BUNDLE_KEY = "capship-pro.zip";
const SIGNED_URL_EXPIRES_SECONDS = 900;

export async function redeemProLicense(
  env: Env,
  key: string,
  requesterIp: string | null,
): Promise<RedeemSuccessResponse> {
  const db = getDb(env);
  const license = await findLicenseByKey(db, key);

  if (!license) {
    await logFailedRedemption(db, {
      id: generateId(),
      license_key: key,
      success: 0,
      reason: "not_found",
      ip: requesterIp,
    });
    throw Errors.notFound("License key");
  }

  if (license.status === "used") {
    await logFailedRedemption(db, {
      id: generateId(),
      license_key: key,
      success: 0,
      reason: "already_used",
      ip: requesterIp,
    });
    throw Errors.conflict(
      "This license key has already been redeemed. Each key can only be used once.",
    );
  }

  if (license.status === "revoked") {
    await logFailedRedemption(db, {
      id: generateId(),
      license_key: key,
      success: 0,
      reason: "revoked",
      ip: requesterIp,
    });
    throw Errors.forbidden("This license key has been revoked.");
  }

  const activatedAt = new Date().toISOString();
  const wasRedeemed = await redeemLicense(db, key, activatedAt, {
    id: generateId(),
    license_key: key,
    success: 1,
    reason: null,
    ip: requesterIp,
  });

  if (!wasRedeemed) {
    throw Errors.conflict(
      "This license key has already been redeemed. Each key can only be used once.",
    );
  }

  const downloadUrl = await createSignedDownloadUrl(
    env,
    PRO_BUNDLE_KEY,
    SIGNED_URL_EXPIRES_SECONDS,
  );

  return { downloadUrl, expiresInSeconds: SIGNED_URL_EXPIRES_SECONDS };
}

export async function createLicense(
  env: Env,
  payload: Omit<CreateLicensePayload, "id">,
): Promise<void> {
  const db = getDb(env);
  const existing = await findLicenseByPolarId(db, payload.polar_id);
  if (existing) return;
  await insertLicense(db, { id: generateId(), ...payload });
}

export async function revokeLicenseByKey(env: Env, key: string): Promise<void> {
  const db = getDb(env);
  const license = await findLicenseByKey(db, key);
  if (!license) throw Errors.notFound("License key");
  await revokeLicense(db, key);
}
