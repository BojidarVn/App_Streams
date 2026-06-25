# Avtoikonom Admin E2E Automation

[![Cypress](https://github.com/BojidarVn/App_Streams/actions/workflows/cypress.yml/badge.svg)](https://github.com/BojidarVn/App_Streams/actions/workflows/cypress.yml)

## Overview

This project contains Cypress + TypeScript end-to-end tests for the Avtoikonom admin application:

```text
https://dev.admin.avtoikonom.com
```

The main covered business workflow is:

```text
Login -> Requests landing page -> Partners -> Create Partner -> Validate created Partner -> Update same Partner -> Validate updated Partner
```

The solution intentionally favors readability, maintainability, and pragmatic engineering decisions over unnecessary framework complexity. It is structured so it can be easily extended as the test suite grows.

## Design Goals

- Keep the test flow readable for reviewers.
- Use maintainable Page Objects without hiding the business workflow.
- Prefer pragmatic engineering decisions over framework-heavy abstractions.
- Use stable selectors where the application provides them.
- Generate dynamic test data to avoid collisions in a shared environment.
- Avoid unnecessary framework complexity such as inheritance-heavy base classes.

## Tech Stack

- Cypress
- TypeScript
- Node.js / npm

## Prerequisites

- Node.js 20 or compatible current LTS version
- npm
- Access to the dev admin environment
- Valid test credentials

## Installation

Install dependencies:

```bash
npm ci
```

If `package-lock.json` is not available, use:

```bash
npm install
```

## Configuration

Create a local Cypress env file:

```bash
cp cypress.env.example.json cypress.env.json
```

Then set the credentials:

```json
{
  "email": "<email>",
  "password": "<password>"
}
```

`cypress.env.json` is intentionally ignored by Git and must not be committed.

## Running Tests

Typecheck:

```bash
npm run typecheck
```

Open Cypress UI:

```bash
npm run cy:open
```

Run safe smoke checks. This is safe to run often because it does not create Partners:

```bash
npm run cy:run:smoke
```

Run the main Partner lifecycle test:

```bash
npm run cy:run:lifecycle
```

Important: `npm run cy:run:lifecycle` creates one real Partner in the dev environment on every successful run and updates the same Partner. Run it intentionally, not repeatedly without need.

`npm run cy:run` runs all Cypress specs. It is kept as a generic Cypress command, but it is not the recommended default for CI or frequent local validation because it includes the lifecycle spec.

## Test Coverage

- `login.cy.ts`
  - Logs in with configured credentials.
  - Validates that the user lands on the Requests page.

- `partners-navigation.cy.ts`
  - Logs in.
  - Opens the Partners page.
  - Validates basic Partners page behavior and search.

- `partner-form.cy.ts`
  - Opens the New Partner modal.
  - Fills the required fields.
  - Uploads and confirms the logo crop modal.
  - Does not save the Partner.

- `partners.cy.ts`
  - Creates one unique Partner.
  - Validates the created Partner in the Partners list.
  - Updates the same Partner.
  - Validates the updated Partner in the Partners list.
  - Does not delete the Partner.

## Project Structure

```text
cypress/
  e2e/
    login.cy.ts
    partner-form.cy.ts
    partners-navigation.cy.ts
    partners.cy.ts
  fixtures/
    logo.jpg
    partnerData.json
  pages/
    LoginPage.ts
    PartnerFormModal.ts
    PartnersPage.ts
    RequestsPage.ts
  support/
    commands.ts
    e2e.ts
  types/
    partner.ts
  utils/
    PartnerFactory.ts
```

## Architecture Decisions

- Page Object Model is used for screen-level interactions.
- Test data is split into:
  - static fixture data in `partnerData.json`
  - unique generated values in `PartnerFactory`
- Credentials are read from Cypress env values.
- Requests to Partners navigation uses direct route navigation to `/partners`. The sidebar is icon-only in the current UI, so direct navigation is more stable for this assignment than coupling tests to visual icon order.
- The main lifecycle test keeps the business flow visible in the spec instead of hiding it behind one large helper method.

## Engineering Trade-offs

- No `BasePage` hierarchy is used because the current scope does not justify inheritance.
- No custom wrapper framework is built around Cypress.
- Excessive helper abstractions are avoided so the tests remain easy to follow.
- The business flow remains visible inside the main lifecycle spec.
- Dynamic test data prevents collisions without introducing unreliable UI cleanup.
- UI cleanup is not automated because Partner deletion requires Google Authenticator OTP/TOTP.

## Selectors

The implementation prefers stable selectors in this order:

1. IDs discovered in the UI, for example `#search-partners`, `#name-field`, `#address-field`.
2. Visible button/menu text where no stable ID exists.
3. Scoped Ant Design selectors only where needed for dropdowns and row actions.

XPath is not used.

## Test Data

Static data:

- Address: `Sofia, Bulgaria`
- Partner type: `Service`
- Service type: configured in `partnerData.json`
- Subscription tier: configured in `partnerData.json`
- Logo fixture: `cypress/fixtures/logo.jpg`

Dynamic data:

- Partner name
- Updated Partner name
- Phone
- Updated phone
- Contact person
- Updated contact person
- Description
- Updated description

Dynamic values are generated by `PartnerFactory` to avoid collisions in the shared dev environment.

## Cleanup Strategy

Automated UI cleanup is intentionally not implemented.

Manual verification showed that deleting a Partner requires a valid Google Authenticator OTP/TOTP code. Because that is a second-factor confirmation and no supported automated TOTP strategy is available, the test does not delete created Partners.

Instead:

- The main E2E test creates one Partner per run.
- Partner names are unique.
- The test updates the same Partner it creates.
- The lifecycle test should not be run repeatedly without need.

## Assumptions

- The configured user can access `/requests` and `/partners`.
- The dev environment contains the configured service type and subscription tier.
- Google Places suggestions are available for `Sofia, Bulgaria`.
- The Partners table displays enough data to validate name, phone, contact person, and address.
- Delete cleanup requires OTP/TOTP and is out of scope for this assignment.

## Known Limitations

- The lifecycle test leaves data in the dev environment.
- Some UI controls are Ant Design components, so a few interactions require scoped Ant selectors and `force: true`.
- The address field requires selecting a Google Places autocomplete suggestion, not only typing text.
- Running all specs with `npm run cy:run` includes the lifecycle spec and creates persistent data.

## CI/CD

The GitHub Actions workflow is defined at:

```text
.github/workflows/cypress.yml
```

CI runs only:

- dependency installation
- `npm run typecheck`
- `npm run cy:run:smoke`

The Partner lifecycle test is intentionally excluded from default CI execution because it creates persistent data in the shared dev environment and UI deletion requires Google Authenticator OTP/TOTP.

Credentials are expected to be provided through GitHub secrets:

- `CYPRESS_EMAIL`
- `CYPRESS_PASSWORD`

## Future Improvements

- Execute smoke tests automatically on every push while keeping lifecycle tests manual to avoid creating unnecessary test data.
- Add a supported cleanup API or test-only cleanup mechanism if the application provides one.
- Add dedicated reporting artifacts for CI runs.
- Add `data-testid` attributes in the application for key actions and fields.
- Expand assertions around API response bodies after the core flow is stable.
