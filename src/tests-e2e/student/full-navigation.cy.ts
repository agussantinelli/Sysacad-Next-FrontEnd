/// <reference types="cypress" />
/// <reference types="cypress" />
describe('Student Enrollment Flow', () => {
  beforeEach(() => {
    cy.login('maria@sysacad.com', '123456');
  });

  it('should navigate through the student enrollment process', () => {
    // 1. Enter Inscripción a Cursado
    cy.contains('.option-card', 'Inscripción a Cursado').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/academic/inscription-course');

    // 2. Return to Dashboard via "Volver" button
    cy.contains('button', 'Volver').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    // 3. Enter Inscripción a Examen
    cy.contains('.option-card', 'Inscripción a Examen').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/academic/inscription-exam');

    // 4. Return to Dashboard
    cy.contains('button', 'Volver').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    // 5. Enter Mis Inscripciones
    cy.contains('.option-card', 'Mis Inscripciones').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/academic/my-inscriptions');

    // 6. Return to Dashboard
    cy.contains('button', 'Volver').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    // 7. Enter Estado Académico
    cy.contains('.option-card', 'Estado Académico').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/academic/status');

    // 8. Open modal, close it, and return
    cy.contains('Ver Historial', { timeout: 10000 }).first().click({ force: true });
    cy.get('app-history-modal', { timeout: 10000 }).should('be.visible');
    cy.get('app-history-modal button.btn-close').click({ force: true });
    cy.get('app-history-modal').should('not.exist');
    cy.contains('button', 'Volver').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    // 9. Open Avisos
    cy.contains('.option-card', 'Avisos').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/announcements');

    cy.get('body').then(($body) => {
      if ($body.find('.notification-card.unread .btn-mark-read').length > 0) {
        cy.get('.notification-card.unread .btn-mark-read').first().click({ force: true });
      }
    });

    cy.contains('button', 'Volver').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    // 10. Finish by going to Mensajes
    cy.contains('.option-card', 'Mensajes').click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/messages');

    cy.log('11. Logout from session');
    cy.get('.profile-btn', { timeout: 10000 }).click({ force: true });
    cy.get('.dropdown-item.logout', { timeout: 10000 }).click({ force: true });
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
