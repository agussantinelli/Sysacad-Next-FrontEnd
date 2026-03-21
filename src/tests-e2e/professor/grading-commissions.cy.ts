/// <reference types="cypress" />

describe('Professor Course Grading Flow', () => {
  beforeEach(() => {
    cy.login('laura@sysacad.com', '123456');
  });

  it('should load partial student grades correctly', () => {
    cy.log('1. Go to "Mis Comisiones"');
    cy.contains('.option-card', 'Mis Comisiones').click({ force: true });

    cy.log('2. Open the grading grid for the first commission');
    cy.get('button.btn-grade').first().click({ force: true });

    cy.log('3. Input a grade for one student');
    cy.get('input.grade-input').first().clear().type('8');
    
    cy.log('4. Save progress');
    cy.get('button.btn-save').click({ force: true });

    cy.log('5. Verify success notification');
    cy.get('app-alert-message').should('be.visible').and('contain.text', 'éxito');
  });
});
