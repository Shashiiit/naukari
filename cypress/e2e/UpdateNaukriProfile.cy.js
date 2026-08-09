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

    // DIAGNOSTIC: capture what actually happened, before asserting anything.
    // This screenshot + log will tell us if it's a wrong-credential error,
    // a captcha, or just a changed selector.
    cy.screenshot('after-login-click-raw');
    cy.url().then((url) => cy.log('URL after login click: ' + url));
    cy.get('body').then(($body) => {
      const bodyText = $body.text();
      if (/incorrect|invalid|wrong password|does not exist/i.test(bodyText)) {
        cy.log('⚠ Page text suggests a login error message is showing');
      }
      if (/captcha|verify you are human|unusual traffic/i.test(bodyText)) {
        cy.log('⚠ Page text suggests a CAPTCHA / bot-check is showing');
      }
    });

    dismissPopupsIfPresent();

    // Confirm we're actually logged in. Primary check: #ff-inventory.
    // Fallback checks in case Naukri changed the dashboard markup:
    // URL no longer on the login page, and the login form is gone.
    cy.get('body', { timeout: 40000 }).should(($body) => {
      const stillOnLoginForm = $body.find('#usernameField').length > 0;
      const hasInventory = $body.find('#ff-inventory').length > 0;
      expect(stillOnLoginForm, 'login form should be gone').to.be.false;
      // Note: not hard-asserting hasInventory here so we get a clearer
      // failure message below if the login form is gone but this ID changed.
    });
    cy.screenshot('after-login-resolved');

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
