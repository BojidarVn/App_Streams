import partnerData from "../fixtures/partnerData.json";
import { LoginPage } from "../pages/LoginPage";
import { PartnerFormModal } from "../pages/PartnerFormModal";
import { PartnersPage } from "../pages/PartnersPage";
import { RequestsPage } from "../pages/RequestsPage";
import { PartnerFactory } from "../utils/PartnerFactory";

describe("Partners", () => {
  it("creates, validates, updates, and validates a Partner", () => {
    const loginPage = new LoginPage();
    const requestsPage = new RequestsPage();
    const partnersPage = new PartnersPage();
    const partnerFormModal = new PartnerFormModal();
    const partner = PartnerFactory.createPartner(partnerData);
    const updatedPartner = PartnerFactory.createPartnerUpdate(partner.name);

    cy.env(["email", "password"]).then(({ email, password }) => {
      expect(email, "email").to.be.a("string").and.not.be.empty;
      expect(password, "password").to.be.a("string").and.not.be.empty;

      cy.intercept("POST", "**/admin/partner").as("createPartner");
      cy.intercept("PUT", "**/admin/partner/**").as("updatePartner");

      loginPage.visit();
      loginPage.assertLoaded();

      cy.login(email, password);
      requestsPage.assertLoaded();

      requestsPage.goToPartners();
      partnersPage.assertLoaded();

      partnersPage.openNewPartnerModal();
      partnerFormModal.assertOpened();
      partnerFormModal.typePartnerName(partner.name);
      partnerFormModal.selectPartnerType(partner.partnerType);
      partnerFormModal.selectServiceType(partner.serviceType);
      partnerFormModal.selectSubscriptionTier(partner.subscriptionTier);
      partnerFormModal.enterAddress(partner.address);
      partnerFormModal.enterPhone(partner.phone);
      partnerFormModal.enterContactPerson(partner.contactPerson);
      partnerFormModal.enterDescription(partner.description);
      partnerFormModal.uploadLogo(partner.logoFileName);
      partnerFormModal.savePhotoIfVisible();
      partnerFormModal.save();

      cy.wait("@createPartner", { timeout: 30000 })
        .its("response.statusCode")
        .should("be.oneOf", [200, 201]);

      partnersPage.searchPartner(partner.name);
      partnersPage.assertPartnerVisible(partner.name);
      partnersPage.assertPartnerRowContains([
        partner.phone,
        partner.contactPerson,
        partner.address,
      ]);

      partnersPage.openActionsForPartner(partner.name);
      partnersPage.clickEditAction();
      partnerFormModal.assertOpened();
      partnerFormModal.typePartnerName(updatedPartner.name!);
      partnerFormModal.enterPhone(updatedPartner.phone!);
      partnerFormModal.enterContactPerson(updatedPartner.contactPerson!);
      partnerFormModal.enterDescription(updatedPartner.description!);
      partnerFormModal.save();

      cy.wait("@updatePartner", { timeout: 30000 })
        .its("response.statusCode")
        .should("eq", 200);

      partnersPage.searchPartner(updatedPartner.name!);
      partnersPage.assertPartnerVisible(updatedPartner.name!);
      partnersPage.assertPartnerRowContains([
        updatedPartner.phone!,
        updatedPartner.contactPerson!,
      ]);
    });
  });
});
