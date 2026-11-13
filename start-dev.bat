@echo off
title GE ESPORTS Dev Launcher
echo ================================================
echo Starting GE ESPORTS Full-Stack Environment...
echo ================================================

start "GE ESPORTS Backend API (Port 5000)" cmd /k "npm run server"
start "GE ESPORTS Frontend (Port 5173)" cmd /k "npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - Backend:  http://localhost:5000/api/health
echo - Frontend: http://localhost:5173/
echo.
pause

