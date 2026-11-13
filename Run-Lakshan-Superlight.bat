@echo off
title Lakshan Superlight - Event & POS System
echo ===================================================
echo     LAKSHAN SUPERLIGHT ENTERPRISE SYSTEM
echo ===================================================
echo.
echo Starting system server on http://localhost:3000...
echo.

cd /d "%~dp0"
start "" http://localhost:3000/
call npm.cmd run preview -- --port 3000 --host

pause
