describe('Update Naukri Profile', () => {
  before(function () {
    //runs once before all tests in this block
    cy.fixture('loginData').then(function (data) {
      this.data = data
    });
  })
  it('should update the profile successfully', function () {
    // Use GitHub Secrets (env vars) if available, otherwise fall back to fixture file
    const username = Cypress.env('NAUKRI_USERNAME') || this.data.username
    const password = Cypress.env('NAUKRI_PASSWORD') || this.data.password
    cy.visit('https://naukri.com')
    cy.get('#login_Layer').click()
    cy.get('.form > :nth-child(2) > input').type(username)
    cy.get(':nth-child(3) > input').type(password)
    cy.get(':nth-child(6) > .btn-primary').click()
    cy.wait(2000)
    cy.visit('https://www.naukri.com/mnjuser/profile')
    cy.wait(2000)
    cy.get('#attachCV')
      .attachFile("Vishal_Gupta_QA_4.10+YOE-Resume.pdf")
      .then(() => {
        cy.get('.cnt > .head').should('be.visible')
      })
  })
})
/**
 * To upload a file in Cypress, use the 'cypress-file-upload' plugin.
 * 1. Install it: npm install --save-dev cypress-file-upload
 * 2. Add `import 'cypress-file-upload';` to your support/e2e.js or at the top of your test file.
 * 3. Use `.attachFile()` on the file input element.
 */