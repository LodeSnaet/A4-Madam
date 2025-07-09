# Uncomment and adjust if your docker-compose.yml is not in the script's directory
# Set-Location -Path "C:\path\to\your\docker-compose\dir"

Write-Host "Starting Docker Compose..."
# Use Invoke-Expression (iex) to run external commands, or specify the full path if not in PATH
# -d for detached mode, -f for --file if your compose file has a non-default name
try {
    docker-compose up -d
} catch {
    Write-Error "Failed to start Docker Compose: $($_.Exception.Message)"
    # Optionally, exit the script if this step is critical
    # Exit 1
}

Write-Host "Starting DDEV..."
try {
    ddev start
} catch {
    Write-Error "Failed to start DDEV: $($_.Exception.Message)"
    # Optionally, exit the script
    # Exit 1
}

Write-Host "Launching DDEV site with /admin path..."
try {
    # Add the /admin path directly to the ddev launch command
    ddev launch /admin
} catch {
    Write-Error "Failed to launch DDEV site with /admin path: $($_.Exception.Message)"
    # This might fail if the site isn't ready immediately, consider a delay or retry
}

Write-Host "Startup tasks completed."

# Optional: Add a pause at the end if you're running it interactively and want to see output
# Read-Host "Press Enter to continue..."