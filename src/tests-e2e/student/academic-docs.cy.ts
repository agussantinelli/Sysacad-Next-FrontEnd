/// <reference types="cypress" />

describe('Student Documents and Academic Status Flow', () => {
  beforeEach(() => {
    cy.login('maria@sysacad.com', '123456');
  });

  it('should verify academic performance and download certificates', () => {
    cy.log('1. Access "Estado Académico" module');
    cy.contains('.option-card', 'Estado Académico').click({ force: true });

    cy.log('2. Verify academic status table');
    cy.get('table', { timeout: 10000 }).should('be.visible');
    
    cy.log('3. Open subject history modal');
    cy.contains('button', 'Ver Historial', { timeout: 10000 }).first().click({ force: true });
    cy.get('.modal-content', { timeout: 10000 }).should('be.visible');
    cy.get('.modal-title').should('contain.text', 'Historial');
    
    // Use scoped selector for the modal close button to avoid accidental logout
    cy.get('.modal-content').contains('button', 'Cerrar').click({ force: true });
    cy.get('.modal-content').should('not.exist');

    cy.log('4. Navigate back to Dashboard');
    cy.get('.logo-area').click({ force: true });
    cy.url().should('include', '/dashboard');

    cy.log('5. Access "Certificado Regularidad" module');
    cy.contains('.option-card', 'Certificado Regularidad').click({ force: true });

    cy.log('6. Download PDF Certificate');
    cy.contains('button', 'Descargar PDF', { timeout: 10000 }).should('be.visible').click({ force: true });
    
    // Wait for generation to finish (spinner disappears)
    cy.contains('span', 'Generando', { timeout: 15000 }).should('not.exist');

    cy.log('7. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
