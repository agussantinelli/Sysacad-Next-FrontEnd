/// <reference types="cypress" />
describe('Student Navigation Flow', () => {
  beforeEach(() => {
    // Basic setup: Visit login page
    cy.visit('/login');
    
    // Perform login
    cy.get('#email').type('agustinsantinelli@gmail.com');
    cy.get('#password').type('123456');
    cy.get('button.submit-btn').click();
    
    // Verify login successful (dashboard loaded)
    cy.url().should('include', '/dashboard');
  });

  it('should navigate through the student enrollment process', () => {
    // 1. Enter Inscripción a Cursado
    cy.contains('.option-card', 'Inscripción a Cursado').click({ force: true });
    cy.url().should('include', '/student/inscription-course');
    
    // 2. Return to Dashboard via Logo
    cy.get('.logo-area').click({ force: true });
    cy.url().should('include', '/dashboard');

    // 3. Enter Inscripción a Examen
    cy.contains('.option-card', 'Inscripción a Examen').click({ force: true });
    cy.url().should('include', '/student/inscription-exam');
    
    // 4. Return to Dashboard
    cy.get('.logo-area').click({ force: true });
    cy.url().should('include', '/dashboard');

    // 5. Enter Mis Inscripciones
    cy.contains('.option-card', 'Mis Inscripciones').click({ force: true });
    cy.url().should('include', '/student/my-inscriptions');
    
    // 6. Return to Dashboard
    cy.get('.logo-area').click({ force: true });
    cy.url().should('include', '/dashboard');

    // 7. Enter Estado Académico
    cy.contains('.option-card', 'Estado Académico').click({ force: true });
    cy.url().should('include', '/student/academic-status');

    // 8. Open modal, close it, and return
    cy.get('app-table button').first().click({ force: true }); 
    cy.get('app-history-modal').should('be.visible');
    cy.get('app-history-modal button.btn-close').click({ force: true });
    cy.get('app-history-modal').should('not.exist');
    cy.get('.logo-area').click({ force: true });
    cy.url().should('include', '/dashboard');

    // 9. Open Avisos, mark first as read, and go back
    cy.contains('.option-card', 'Avisos').click({ force: true });
    cy.url().should('include', '/announcements');
    
    // Mark first unread aviso as read
    cy.get('.notification-card.unread .btn-mark-read').first().click({ force: true });
    
    cy.get('.logo-area').click({ force: true });
    cy.url().should('include', '/dashboard');

    // 10. Finish by going to Mensajes
    cy.contains('.option-card', 'Mensajes').click({ force: true });
    cy.url().should('include', '/messages');
    cy.contains('.category-subtitle', 'Grupos').should('exist');
  });
});
