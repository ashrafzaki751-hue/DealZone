@echo off
color 0a
title DealZone Scraper Bot - تحديث العروض التلقائي
echo ===================================================
echo 🤖 DealZone Scraper Bot - أداة التحديث التلقائي
echo ===================================================

:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [خطأ] Node.js غير مثبت على جهازك!
    echo يجب تحميل وتثبيت Node.js من الموقع الرسمي: https://nodejs.org
    echo بعد التثبيت، أعد تشغيل هذا الملف.
    pause
    exit /b
)

echo [1] جاري التحقق من المكاتب المطلوبة (Axios, Cheerio)...
if not exist "node_modules\axios" (
    echo جاري تثبيت المكاتب لأول مرة... قد يستغرق دقيقة.
    call npm install axios cheerio
)

echo [2] جاري تشغيل الروبوت لسحب العروض الحقيقية من أمازون...
node deal_bot.js

echo ===================================================
echo ✅ العملية اكتملت! 
echo تأكد من تشغيل ملف sync_dealzone.bat لرفع العروض الجديدة لموقعك.
echo ===================================================
pause
