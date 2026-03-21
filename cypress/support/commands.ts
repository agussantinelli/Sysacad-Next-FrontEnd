declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button.submit-btn').click();
  // Increase timeout to 10s for slow redirection or initial data loading
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
});

export {};