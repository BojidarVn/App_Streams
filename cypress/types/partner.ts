export interface PartnerStaticData {
  address: string;
  partnerType: string;
  serviceType: string;
  subscriptionTier: string;
  logoFileName: string;
}

export interface PartnerData extends PartnerStaticData {
  name: string;
  phone: string;
  contactPerson: string;
  description: string;
  hidden?: boolean;
}

export interface PartnerUpdateData {
  name?: string;
  phone?: string;
  contactPerson?: string;
  description?: string;
  hidden?: boolean;
}
