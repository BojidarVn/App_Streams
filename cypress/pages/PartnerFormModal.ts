export class PartnerFormModal {
  assertOpened(): void {
    cy.get("#name-field", { timeout: 30000 })
      .should("be.visible")
      .parents(".ant-modal-content")
      .should("be.visible");
    cy.get("#partner-type-field").should("exist");
    cy.get("#service-types-field").should("exist");
    cy.get("#subscription-tier-field").should("exist");
    cy.get("#address-field").should("be.visible");
    cy.get("#phone-field").should("exist");
    cy.get("#contact-person-field").should("exist");
    cy.get("#description-field").should("exist");
  }

  typePartnerName(name: string): void {
    cy.get("#name-field").scrollIntoView().clear().type(name);
  }

  selectPartnerType(partnerType: string): void {
    cy.get("#partner-type-field").click({ force: true });
    cy.contains(
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
      partnerType,
    ).click({ force: true });
  }

  selectServiceType(serviceType: string): void {
    cy.get("#service-types-field").click({ force: true });
    cy.contains(
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
      serviceType,
    ).click({ force: true });
  }

  selectSubscriptionTier(subscriptionTier: string): void {
    cy.get("#subscription-tier-field").click({ force: true });
    cy.contains(
      ".ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option",
      subscriptionTier,
    ).click({ force: true });
  }

  enterAddress(address: string): void {
    cy.get("#address-field").scrollIntoView().clear().type(address);
    cy.get(".pac-container .pac-item:visible", { timeout: 10000 })
      .first()
      .click({ force: true });

    cy.contains("Please choose an address!").should("not.exist");
  }

  enterPhone(phone: string): void {
    cy.get("#phone-field").scrollIntoView().clear().type(phone);
  }

  enterContactPerson(contactPerson: string): void {
    cy.get("#contact-person-field").scrollIntoView().clear().type(contactPerson);
  }

  enterDescription(description: string): void {
    cy.get("#description-field").scrollIntoView().clear().type(description);
  }

  uploadLogo(fileName: string): void {
    cy.get('input[type="file"][name="file-upload"]').selectFile(
      `cypress/fixtures/${fileName}`,
      { force: true },
    );
  }

  savePhotoIfVisible(): void {
    cy.contains(".ant-modal:visible", "Edit photo", { timeout: 30000 })
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Save").click({ force: true });
      });

    cy.contains(".ant-modal:visible", "Edit photo", { timeout: 30000 }).should(
      "not.exist",
    );
  }

  save(): void {
    cy.contains(".ant-modal:visible button", "Save")
      .scrollIntoView()
      .click({ force: true });
  }
}
