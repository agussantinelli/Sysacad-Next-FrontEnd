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
    // 1. Enter Inscripciones a Cursado
    cy.contains('button.nav-link', 'Inscripciones').click();
    cy.contains('a.nav-dropdown-item', 'Inscripción a Cursado').click();
    cy.url().should('include', '/student/inscription-course');
    
    // 2. Click "Volver" (Logo area usually goes back to dashboard in this app)
    // Looking at navbar.component.html: <div class="logo-area" routerLink="/dashboard">
    cy.get('.logo-area').click();
    cy.url().should('include', '/dashboard');

    // 3. Enter Inscripción a Examen
    cy.contains('button.nav-link', 'Inscripciones').click();
    cy.contains('a.nav-dropdown-item', 'Inscripción a Examen').click();
    cy.url().should('include', '/student/inscription-exam');
    
    // 4. Click "Volver"
    cy.get('.logo-area').click();
    cy.url().should('include', '/dashboard');

    // 5. Enter Mis Inscripciones
    cy.contains('button.nav-link', 'Inscripciones').click();
    cy.contains('a.nav-dropdown-item', 'Mis Inscripciones').click();
    cy.url().should('include', '/student/my-inscriptions');
    
    // 6. Click "Volver"
    cy.get('.logo-area').click();
    cy.url().should('include', '/dashboard');

    // 7. Enter Cursado y Notas (Estado Académico)
    cy.contains('button.nav-link', 'Académico').click();
    cy.contains('a.nav-dropdown-item', 'Estado Académico').click();
    cy.url().should('include', '/student/academic-status');

    // 8. Open modal, close it, and click "Volver"
    // The academic status has a table with actions. Usually the first action is "Ver Historia" (based on academic-status.component.ts)
    cy.get('app-table button').first().click(); 
    cy.get('app-history-modal').should('be.visible');
    cy.get('app-history-modal button.btn-close').click(); // Assuming standard close button class
    cy.get('app-history-modal').should('not.exist');
    cy.get('.logo-area').click();
    cy.url().should('include', '/dashboard');

    // 9. Open Avisos, mark first as read, and go back
    cy.contains('button.nav-link', 'Institucional').click();
    cy.contains('a.nav-dropdown-item', 'Avisos').click();
    cy.url().should('include', '/announcements');
    
    // Mark first unread aviso as read
    cy.get('.notification-card.unread .btn-mark-read').first().click();
    
    cy.get('.logo-area').click();
    cy.url().should('include', '/dashboard');

    // 10. Finish by going to Mensajes
    cy.contains('button.nav-link', 'Comunicación').click();
    cy.contains('a.nav-dropdown-item', 'Mensajes').click();
    cy.url().should('include', '/messages');
    cy.contains('.category-subtitle', 'Grupos').should('exist'); // Verify we are in messages
  });
});
