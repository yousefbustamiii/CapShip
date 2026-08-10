import type { BenefitGrantLicenseKeysProperties } from "@polar-sh/sdk/models/components/benefitgrantlicensekeysproperties";
import type { WebhookBenefitGrantCreatedPayload } from "@polar-sh/sdk/models/components/webhookbenefitgrantcreatedpayload";
import type { PolarBenefitGrantCreatedEvent } from "@/domain/webhooks/webhooks.types";

export type { BenefitGrantLicenseKeysProperties, WebhookBenefitGrantCreatedPayload };

export type PolarWebhookEvent = PolarBenefitGrantCreatedEvent | { type?: string };

export interface PolarLicenseKeyDetail {
  id: string;
  key: string;
  status: string;
}
