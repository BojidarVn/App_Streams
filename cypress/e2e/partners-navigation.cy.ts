import { LoginPage } from "../pages/LoginPage";
import { PartnersPage } from "../pages/PartnersPage";
import { RequestsPage } from "../pages/RequestsPage";

describe("Partners navigation", () => {
  it("logs in and opens the Partners page", () => {
    const loginPage = new LoginPage();
    const requestsPage = new RequestsPage();
    const partnersPage = new PartnersPage();
    const harmlessSearchQuery = "PartnerThatShouldNotExist-Phase3";

    cy.env(["email", "password"]).then(({ email, password }) => {
      expect(email, "email").to.be.a("string").and.not.be.empty;
      expect(password, "password").to.be.a("string").and.not.be.empty;

      loginPage.visit();
      loginPage.assertLoaded();

      cy.login(email, password);
      requestsPage.assertLoaded();

      requestsPage.goToPartners();
      partnersPage.assertLoaded();

      partnersPage.searchPartner(harmlessSearchQuery);
      partnersPage.assertPartnerNotVisible(harmlessSearchQuery);
      partnersPage.clearSearch();
    });
  });
});
