# Naukri Profile Auto-Updater 🚀

A simple Cypress automation script to automatically update your **Naukri.com** profile.  
Recruiters often use Naukri’s **Resdex database** and filter candidates by *“last updated”*.  
This script saves you the hassle of manually updating your profile every day.

---

## ⚠️ Disclaimer
This project is created **for educational purposes only**.  
To the best of my knowledge, Naukri does not explicitly prohibit automation in its published terms.  
However, automated updates may be interpreted as non-user-generated activity and could conflict with their intended use.  
Please use this script responsibly, review Naukri’s user agreements, and proceed at your own risk.

---

## ✨ Features
- Automates daily profile update on Naukri.com
- Runs in **headless mode** (no browser window pop-up)
- Single-click `.bat` execution
- Optional auto-run on **Windows startup**

---

## 📦 Prerequisites
- [Node.js](https://nodejs.org/) (v14 or above recommended)  
- [Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress)  

---

## 🔧 Installation & Setup (One-Time)

1. **Clone this repo**  
   ```bash
   git clone https://github.com/your-username/naukri-auto-update.git
   cd naukri-auto-update
2. **Install Cypress**
 ```bash
npm install cypress --save-dev
```
3. **Install Cypress Upload Plugin**
```bash
npm install --save-dev cypress-file-upload
```
4. **Add this line in support/e2e.js (or at the top of your test file):**

```bash
import 'cypress-file-upload'
```
5. **Add your resume**
Place your resume file in the fixtures folder.

6. **Update login credentials**
--Modify LoginData.json with your Naukri username and password.

7. **Update script with resume name**
--In updateNaukriProfile.cy.js, update the resume file name inside .attachFile().

8. **Configure the .bat file**
--In the support folder, edit the .bat file to match your local Cypress installation path.
## ▶️ Usage

* Double-click the `.bat` file → Cypress will run in headless mode and update your Naukri profile.
* (Optional) Add the `.bat` file to your **Windows startup folder** to auto-run the script every time you start your system.

---

## 🤝 Contributions

Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a pull request.

---
