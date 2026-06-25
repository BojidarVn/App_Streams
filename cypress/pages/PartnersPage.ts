export class PartnersPage {
  open(): void {
    cy.visit("/partners");
  }

  assertLoaded(): void {
    cy.location("pathname", { timeout: 30000 }).should("eq", "/partners");
    cy.get("#search-partners", { timeout: 30000 }).should("be.visible");
    cy.contains("button", "New partner", { timeout: 30000 }).should("be.visible");
  }

  searchPartner(partnerName: string): void {
    cy.get("#search-partners").clear().type(partnerName);
  }

  clearSearch(): void {
    cy.get("#search-partners").clear();
  }

  openNewPartnerModal(): void {
    cy.contains("button", "New partner").click();
  }

  openActionsForPartner(partnerName: string): void {
    this.searchPartner(partnerName);
    this.assertPartnerVisible(partnerName);
    cy.get(".ant-table-body").scrollTo("right", { ensureScrollable: false });
    cy.contains(".ant-table-row", partnerName, { timeout: 30000 })
      .find("#action-button")
      .click({ force: true });
  }

  clickEditAction(): void {
    cy.contains('[role="menuitem"]', "Edit", { timeout: 10000 }).click({
      force: true,
    });
  }

  assertPartnerVisible(partnerName: string): void {
    cy.contains(partnerName, { timeout: 30000 }).should("be.visible");
  }

  assertPartnerNotVisible(partnerName: string): void {
    cy.contains(partnerName).should("not.exist");
  }

  assertPartnerRowContains(values: string[]): void {
    cy.get(".ant-table-body").scrollTo("left", { ensureScrollable: false });

    values.forEach((value) => {
      cy.contains(value, { timeout: 30000 }).should("be.visible");
    });
  }
}
