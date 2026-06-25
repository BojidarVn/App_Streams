import { LoginPage } from "../pages/LoginPage";
import { RequestsPage } from "../pages/RequestsPage";

describe("Login", () => {
  it("logs in and lands on the Requests page", () => {
    const loginPage = new LoginPage();
    const requestsPage = new RequestsPage();

    cy.env(["email", "password"]).then(({ email, password }) => {
      expect(email, "email").to.be.a("string").and.not.be.empty;
      expect(password, "password").to.be.a("string").and.not.be.empty;

      loginPage.visit();
      loginPage.assertLoaded();

      cy.login(email, password);

      requestsPage.assertLoaded();
    });
  });
});
