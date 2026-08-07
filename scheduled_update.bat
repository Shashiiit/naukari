@echo off
:: Naukri Profile Auto-Update - Scheduled Task Script
:: This script is designed to run via Windows Task Scheduler (no pause, no user interaction)

cd /d "C:\Users\Shashi1\Desktop\Cypress_Naukri_DailyProfileUpdate"

:: Log start time
echo [%date% %time%] Starting Naukri profile update... >> update_log.txt

:: Run Cypress headlessly
call npx cypress run --spec "cypress/e2e/UpdateNaukriProfile.cy.js"

:: Log result
if %ERRORLEVEL% EQU 0 (
    echo [%date% %time%] Profile updated successfully. >> update_log.txt
) else (
    echo [%date% %time%] Update FAILED with error code %ERRORLEVEL%. >> update_log.txt
)
