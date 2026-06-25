export class LoginPage {
  visit(): void {
    cy.visit("/login");
  }

  assertLoaded(): void {
    cy.location("pathname").should("include", "/login");
    cy.contains("Логин").should("be.visible");
    cy.get("input").first().should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("button", "Логин").should("be.visible").and("be.enabled");
  }

  loginWithCredentials(email: string, password: string): void {
    cy.get("input").first().clear().type(email);
    cy.get('input[type="password"]').clear().type(password, { log: false });
    cy.contains("button", "Логин").click();
  }
}
