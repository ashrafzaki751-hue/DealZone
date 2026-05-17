@echo off
title DealZone Auto-Scraper Bot 🤖
echo ===================================================
echo 🤖 DealZone Auto-Scraper and Deploy Bot
echo ===================================================
echo.
echo ⏳ 1. Running Dynamic Scraper & Updating Database...
node scripts/auto_scraper.js

echo.
echo 📤 2. Uploading fresh data to GitHub Pages...
git add database_v3.js deals_catalog.json main_v3.js index.html run_bot.bat scripts/auto_scraper.js
git commit -m "🤖 Auto-Bot: Dynamic price scraping & catalog expansion (38 deals)"
git push origin main

echo.
echo ===================================================
echo ✅ SUCCESS! Website is updated and LIVE.
echo ===================================================
pause
