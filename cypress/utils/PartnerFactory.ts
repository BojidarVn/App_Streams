import type {
  PartnerData,
  PartnerStaticData,
  PartnerUpdateData,
} from "../types/partner";

export class PartnerFactory {
  static createPartner(staticData: PartnerStaticData): PartnerData {
    const uniqueId = PartnerFactory.uniqueId();

    return {
      ...staticData,
      name: `AutomationPartnerQA-${uniqueId}`,
      phone: `+35988${uniqueId.slice(-7)}`,
      contactPerson: `QA Contact ${uniqueId}`,
      description: `Partner created by Cypress automation ${uniqueId}`,
      hidden: false,
    };
  }

  static createPartnerUpdate(originalName: string): PartnerUpdateData {
    const uniqueId = PartnerFactory.uniqueId();

    return {
      name: `${originalName}-Updated`,
      phone: `+35989${uniqueId.slice(-7)}`,
      contactPerson: `QA Contact Updated ${uniqueId}`,
      description: `Partner updated by Cypress automation ${uniqueId}`,
    };
  }

  static uniqueId(): string {
    return `${Date.now()}`;
  }
}
