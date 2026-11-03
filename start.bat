@echo off
cd /d "%~dp0"
title Booki — Realistic Digital Handwritten Book

echo ========================================================
echo         BOOKI - REALISTIC DIGITAL HANDWRITTEN BOOK
echo ========================================================
echo.

where node >nul 2>&1
if errorlevel 1 goto no_node

if not exist node_modules goto install_deps
goto run_app

:install_deps
echo Bagimliliklar yukleniyor, lutfen bekleyin...
call npm install
if errorlevel 1 goto npm_error

:run_app
echo.
echo Uygulama baslatiliyor...
echo Tarayici aciliyor: http://localhost:5173
echo.

start http://localhost:5173
call npm run dev
goto end

:no_node
echo.
echo [HATA] Node.js bulunamadi!
echo Lutfen https://nodejs.org adresinden Node.js indirin ve kurun.
echo.
pause
exit /b 1

:npm_error
echo.
echo [HATA] npm paketleri yuklenirken bir hata olustu.
echo.
pause
exit /b 1

:end
pause
