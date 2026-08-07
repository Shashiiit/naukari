# Naukri Profile Auto-Update - Windows Task Scheduler Setup
# Run this script ONCE as Administrator to schedule daily 8 AM updates
# To remove the task later: Unregister-ScheduledTask -TaskName "NaukriProfileUpdate" -Confirm:$false

$taskName = "NaukriProfileUpdate"
$batPath = "C:\Users\Shashi1\Desktop\Cypress_Naukri_DailyProfileUpdate\scheduled_update.bat"
$workingDir = "C:\Users\Shashi1\Desktop\Cypress_Naukri_DailyProfileUpdate"

# Check if task already exists
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existingTask) {
    Write-Host "Task '$taskName' already exists. Removing old task..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Define the action - run the bat file
$action = New-ScheduledTaskAction -Execute $batPath -WorkingDirectory $workingDir

# Define the trigger - daily at 8:00 AM
$trigger = New-ScheduledTaskTrigger -Daily -At 8:00AM

# Define settings
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 15)

# Register the task (runs whether user is logged in or not requires password, 
# so we use -RunLevel Limited to run only when logged in without needing password)
Register-ScheduledTask `
    -TaskName $taskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Description "Automatically updates Naukri.com profile daily at 8 AM using Cypress" `
    -RunLevel Limited

Write-Host ""
Write-Host "Task '$taskName' created successfully!" -ForegroundColor Green
Write-Host "Schedule: Daily at 8:00 AM" -ForegroundColor Cyan
Write-Host "Script: $batPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Notes:" -ForegroundColor Yellow
Write-Host "  - Your PC must be ON and you must be logged in at 8 AM"
Write-Host "  - If missed (PC was off), it will run at next login (StartWhenAvailable)"
Write-Host "  - Check update_log.txt in the project folder for run history"
Write-Host ""
Write-Host "To verify: Open Task Scheduler > Task Scheduler Library > look for '$taskName'"
Write-Host "To remove: Run 'Unregister-ScheduledTask -TaskName ""$taskName"" -Confirm:`$false' in PowerShell (Admin)"
