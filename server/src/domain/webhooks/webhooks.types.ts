export interface PolarBenefitGrantCreatedEvent {
  type: "benefit_grant.created";
  data: {
    id: string;
    order_id: string | null;
    customer: {
      email: string;
    };
    benefit: {
      type: string;
    };
    properties: {
      license_key_id?: string;
      licenseKeyId?: string;
    };
  };
}
