import partnerData from "../fixtures/partnerData.json";
import { LoginPage } from "../pages/LoginPage";
import { PartnerFormModal } from "../pages/PartnerFormModal";
import { PartnersPage } from "../pages/PartnersPage";
import { RequestsPage } from "../pages/RequestsPage";
import { PartnerFactory } from "../utils/PartnerFactory";

describe("Partner form", () => {
  it("opens the New Partner modal and fills required fields without saving", () => {
    const loginPage = new LoginPage();
    const requestsPage = new RequestsPage();
    const partnersPage = new PartnersPage();
    const partnerFormModal = new PartnerFormModal();
    const partner = PartnerFactory.createPartner(partnerData);

    cy.env(["email", "password"]).then(({ email, password }) => {
      expect(email, "email").to.be.a("string").and.not.be.empty;
      expect(password, "password").to.be.a("string").and.not.be.empty;

      loginPage.visit();
      loginPage.assertLoaded();

      cy.login(email, password);
      requestsPage.assertLoaded();

      requestsPage.goToPartners();
      partnersPage.assertLoaded();

      cy.contains("button", "New partner").click();

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
    });
  });
});
