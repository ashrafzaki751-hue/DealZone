@echo off
title DealZone Auto-Scraper Loop Bot 🤖
:loop
cls
echo ===================================================
echo 🤖 DealZone Auto-Scraper Loop Bot (Active)
echo ===================================================
echo Last updated: %date% %time%
echo Next update will trigger automatically in 6 hours...
echo ===================================================
echo.
echo ⏳ 1. Running Dynamic Scraper and Updating Database...
node scripts/auto_scraper.js

echo.
echo 📤 2. Uploading fresh data to GitHub Pages...
git add database_v3.js deals_catalog.json main_v3.js index.html run_bot.bat scripts/auto_scraper.js marketing.html dashboard.js dashboard.html
git commit -m "🤖 Auto-Bot: Dynamic price scraping & catalog sync (Loop)"
git push origin main

echo.
echo ===================================================
echo ✅ SUCCESS! Website is updated and LIVE.
echo ===================================================
echo.
echo Sleeping for 6 hours (21600 seconds)...
echo [Do not close this window to keep the site updating automatically]
timeout /t 21600 /nobreak
goto loop
