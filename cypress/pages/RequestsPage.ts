export class RequestsPage {
  assertLoaded(): void {
    cy.location("pathname", { timeout: 30000 }).should("eq", "/requests");
    cy.get("#search-request", { timeout: 30000 }).should("be.visible");
    cy.contains("button", "Създай заявка").should("be.visible");
  }

  goToPartners(): void {
    cy.visit("/partners");
  }
}
