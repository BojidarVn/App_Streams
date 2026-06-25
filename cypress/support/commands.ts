/// <reference types="cypress" />

import { LoginPage } from "../pages/LoginPage";

Cypress.Commands.add("login", (email: string, password: string) => {
  const loginPage = new LoginPage();

  loginPage.loginWithCredentials(email, password);
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
