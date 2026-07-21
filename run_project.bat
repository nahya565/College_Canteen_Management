@echo off
title MITS Canteen Pre-Booking Launcher
cls
echo ======================================================================
echo           MITS CANTEEN PRE-BOOKING SYSTEM LAUNCHER
echo ======================================================================
echo.
echo Please choose a run mode:
echo [1] Integrated Mode (Build Frontend + Serve Everything on Port 8000)
echo [2] Development Mode (Dual Servers: Django on 8000 + Vite Dev on 5173)
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" goto integrated
if "%choice%"=="2" goto development
echo Invalid choice. Exiting...
pause
exit

:integrated
echo.
echo Building frontend assets (Vite)...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Frontend build failed. Please resolve errors before running.
    pause
    exit
)
echo.
echo Starting integrated Django server on http://localhost:8000/...
cd backend
python manage.py runserver 8000
goto end

:development
echo.
echo Starting Django REST Framework Backend in background...
start cmd /k "title Django Backend && echo Starting Django Backend... && cd backend && python manage.py runserver 8000"
echo.
echo Starting React Vite Frontend Development Server...
start cmd /k "title React Frontend && echo Starting React Frontend... && npm run dev"
echo.
echo ======================================================================
echo Both servers have been launched in separate windows!
echo Backend API: http://localhost:8000/api/
echo Frontend App: http://localhost:5173/ (with auto-proxy to backend)
echo ======================================================================
goto end

:end
pause
