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
    
    // Go directly to login page
    cy.visit('https://www.naukri.com/nlogin/login')
    cy.wait(5000)
    
    // Fill login form
    cy.get('input[placeholder*="Email"], input[placeholder*="email"], input[placeholder*="Username"]')
      .first().clear().type(username)
    cy.get('input[type="password"]').first().clear().type(password)
    cy.wait(1000)
    
    // Click the Login button and proceed to profile
    cy.contains('button', /login/i, { timeout: 15000 })
      .click({ force: true })
    cy.wait(8000)

    // Directly visit the profile page once login is submitted
    cy.visit('https://www.naukri.com/mnjuser/profile')
    cy.url({ timeout: 30000 }).should('include', '/mnjuser/profile')
    cy.wait(5000)

    const resumeFile = 'Shashidhar_AgenticAI_Final.docx'

    cy.wait(5000)
    cy.screenshot('profile-page-before-upload')

    // Robust file upload strategy: try direct file input, otherwise find an upload trigger and retry
    cy.get('body', { timeout: 60000 }).then(($body) => {
      // First, check for any file input present in the page
      const $fileInputs = $body.find('input[type="file"]')

      if ($fileInputs.length > 0) {
        // Attach directly to the first file input
        cy.wrap($fileInputs.first()).attachFile(resumeFile, { force: true })
        cy.log('✓ File attached successfully via direct input')
      } else {
        cy.log('No direct file input found, searching for upload trigger...')

        // Look for elements that look like upload triggers and match their visible text
        const uploadCandidates = $body.find('button, a, label, [role="button"], input[type="button"], input[type="submit"], [class*="upload"], [class*="attach"]')

        // Filter candidates by their visible text matching common upload words
        const trigger = Array.from(uploadCandidates).find((el) => {
          const text = (el.innerText || el.value || '')
          return /upload|attach|browse|choose file|select file/i.test(text)
        })

        if (trigger) {
          cy.wrap(trigger).click({ force: true })
          cy.log('✓ Clicked upload trigger')

          // After clicking the trigger, wait briefly and try to find the file input again
          cy.wait(1000)
          cy.get('input[type="file"]', { timeout: 60000 }).then(($after) => {
            if ($after.length > 0) {
              cy.wrap($after.first()).attachFile(resumeFile, { force: true })
              cy.log('✓ File attached successfully after clicking upload trigger')
            } else {
              throw new Error('Upload trigger clicked but no file input appeared')
            }
          })
        } else {
          throw new Error('Could not find file input or upload trigger on the profile page')
        }
      }
    })

    // Wait for upload completion
    cy.get('body', { timeout: 30000 }).should('exist')
    cy.wait(3000)
    cy.screenshot('profile-page-after-upload')
  })
})
/**
 * To upload a file in Cypress, use the 'cypress-file-upload' plugin.
 * 1. Install it: npm install --save-dev cypress-file-upload
 * 2. For a global import, add `import 'cypress-file-upload';` to cypress/support/e2e.js (already present in this repo).
 * 3. Use `.attachFile()` on the file input element.
 */
