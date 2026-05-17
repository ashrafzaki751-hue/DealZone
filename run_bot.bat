@echo off
title DealZone Auto-Bot 🤖
echo ===================================================
echo 🤖 DealZone Auto-Refresh and Deploy Bot
echo ===================================================
echo.
echo ⏳ 1. Updating deals database and resetting timers...
node scripts/auto_refresh.js

echo.
echo 📤 2. Uploading fresh data to GitHub Pages...
git add database_v3.js deals_catalog.json main_v3.js index.html run_bot.bat
git commit -m "🤖 Auto-Bot: Full system update & bug fixes"
git push origin main

echo.
echo ===================================================
echo ✅ SUCCESS! Website is updated and LIVE.
echo ===================================================
pause
