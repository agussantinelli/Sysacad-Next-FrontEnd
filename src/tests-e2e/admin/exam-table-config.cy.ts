/// <reference types="cypress" />

describe('Admin Exam Table Management Flow', () => {
  beforeEach(() => {
    cy.login('admin@sysacad.com', '123456');
  });

  it('should configure an exam call for a subject', () => {
    cy.log('1. Access "Mesas de Examen" management');
    cy.contains('.option-card', 'Mesas de Examen').click({ force: true });

    cy.log('2. Create a new exam table');
    cy.get('button.btn-primary', { timeout: 10000 }).contains(/Nueva|Crear/i).click({ force: true });
    
    cy.log('3. Fill table details (Subject, Date, Court)');
    cy.get('select', { timeout: 10000 }).first().select(1); // Subject
    cy.get('input[type="date"]').type('2025-12-20');
    cy.get('input[type="time"]').type('18:00');
    
    cy.log('4. Submit and publish');
    cy.get('button.btn-primary').contains('Publicar').click({ force: true });
    
    cy.get('app-alert-message', { timeout: 10000 }).should('be.visible');
  });
});
