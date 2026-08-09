import 'cypress-file-upload';

describe('Update Naukri Profile', () => {
  const loginUrl = 'https://www.naukri.com/nlogin/login';
  const profileUrl = 'https://www.naukri.com/mnjuser/profile';

  before(function () {
    cy.fixture('loginData').then(function (data) {
      this.data = data;
    });
  });

  it('should update the profile successfully', function () {
    const username = Cypress.env('NAUKRI_USERNAME') || this.data?.username;
    const password = Cypress.env('NAUKRI_PASSWORD') || this.data?.password;

    expect(username, 'NAUKRI_USERNAME is set').to.be.a('string').and.not.be.empty;
    expect(password, 'NAUKRI_PASSWORD is set').to.be.a('string').and.not.be.empty;

    // Helper: close any popup/modal that Naukri throws up (cross icon / "SKIP AND CONTINUE")
    const dismissPopupsIfPresent = () => {
      cy.get('body').then(($body) => {
        const crossIcon = $body.find('.cross-icon, .crossIcon, [alt="cross-icon"]');
        if (crossIcon.length) {
          cy.wrap(crossIcon.first()).click({ force: true });
        }
      });
      cy.get('body').then(($body) => {
        const skipBtn = $body.find(':contains("SKIP AND CONTINUE")');
        if (skipBtn.length) {
          cy.wrap(skipBtn.first()).click({ force: true });
        }
      });
    };

    // ---- 1. Log in ----
    cy.visit(loginUrl);

    cy.get('#usernameField', { timeout: 15000 })
      .should('be.visible')
      .clear()
      .type(username, { log: false });

    cy.get('#passwordField')
      .should('be.visible')
      .clear()
      .type(password, { log: false });

    cy.contains('button[type="submit"]', 'Login').click();

    // Give the login request + any redirect a moment, then dismiss popups
    cy.wait(3000);
    dismissPopupsIfPresent();

    // Confirm we're actually logged in (Naukri's post-login dashboard container)
    cy.get('#ff-inventory', { timeout: 40000 }).should('exist');
    cy.screenshot('after-login');

    // ---- 2. Go to profile page ----
    cy.visit(profileUrl);
    dismissPopupsIfPresent();
    cy.screenshot('profile-page-before-upload');

    // ---- 3. Attach the resume ----
    const resumeFile = 'Shashidhar_AgenticAI_Final.docx';

    cy.get('input[type="file"]', { timeout: 15000 })
      .should('exist')
      .then(($fileInputs) => {
        cy.wrap($fileInputs.first()).attachFile(resumeFile, { force: true });
        cy.log('✓ File attached');
      });

    cy.wait(2000);
    cy.screenshot('profile-page-after-upload');

    // ---- 4. Save, if a separate save/confirm action is needed ----
    cy.get('body').then(($body) => {
      const saveBtn = $body.find('button:contains("Save")');
      if (saveBtn.length) {
        cy.wrap(saveBtn.first()).click({ force: true });
      }
    });

    cy.wait(2000);

    // ---- 5. Verify the update actually landed (look for "Today"/"today" timestamp) ----
    cy.get('body', { timeout: 20000 }).should(($body) => {
      const text = $body.text();
      expect(text).to.match(/today/i);
    });

    cy.screenshot('profile-update-confirmed');
  });
});
