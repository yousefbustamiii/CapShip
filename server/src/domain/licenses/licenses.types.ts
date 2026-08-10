export type LicenseStatus = "active" | "used" | "revoked";

export interface License {
  id: string;
  key: string;
  polar_id: string;
  polar_order: string | null;
  customer_email: string | null;
  status: LicenseStatus;
  activated_at: string | null;
  created_at: string;
}

export interface CreateLicensePayload {
  id: string;
  key: string;
  polar_id: string;
  polar_order: string | null;
  customer_email: string | null;
}

export interface RedeemSuccessResponse {
  downloadUrl: string;
  expiresInSeconds: number;
}

export interface RedemptionLogPayload {
  id: string;
  license_key: string;
  success: 0 | 1;
  reason: string | null;
  ip: string | null;
}
