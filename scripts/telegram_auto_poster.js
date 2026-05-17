const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ==========================================
// إعدادات البوت (ضع بياناتك هنا)
// ==========================================
const TELEGRAM_BOT_TOKEN = "ضع_توكن_البوت_هنا"; 
const TELEGRAM_CHANNEL_ID = "@ضع_اسم_قناتك_هنا"; // مثال: @DealZoneEg

const catalogPath = path.join(__dirname, '../deals_catalog.json');

async function sendTelegramPost(deal) {
    const discount = Math.round(((deal.oldPrice - deal.newPrice) / deal.oldPrice) * 100);
    
    // تصميم رسالة تسويقية احترافية
    const message = `
🚨 **عرض فلاش حصري! (${deal.category})** 🚨

🔥 **${deal.title}**
${deal.savingNote ? `✨ *${deal.savingNote}*` : ''}

❌ السعر القديم: ~${deal.oldPrice} ${deal.currency}~
✅ السعر الجديد: **${deal.newPrice} ${deal.currency}** (خصم ${discount}%) 😱

🛒 **اشترِ الآن قبل نفاذ الكمية:**
👉 ${deal.link}

⏳ العرض ينتهي قريباً!
#عروض #خصومات #DealZone
    `;

    try {
        // إرسال الصورة مع النص
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
        await axios.post(url, {
            chat_id: TELEGRAM_CHANNEL_ID,
            photo: deal.image,
            caption: message,
            parse_mode: 'Markdown'
        });
        console.log(`✅ تم نشر العرض بنجاح: ${deal.title}`);
    } catch (error) {
        console.error(`❌ خطأ في النشر: يرجى التأكد من التوكن واسم القناة.`);
    }
}

function startAutoPoster() {
    console.log("🤖 بدء تشغيل ماكينة التسويق الآلي للتليجرام...");
    
    const deals = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const hotDeals = deals.filter(d => d.isHot);
    
    if (hotDeals.length === 0) {
        console.log("لا توجد عروض مميزة لنشرها حالياً.");
        return;
    }

    // نشر عرض عشوائي فوراً
    const randomDeal = hotDeals[Math.floor(Math.random() * hotDeals.length)];
    sendTelegramPost(randomDeal);
    
    // برمجة النشر كل 3 ساعات (لتوليد مبيعات مستمرة)
    setInterval(() => {
        const nextDeal = hotDeals[Math.floor(Math.random() * hotDeals.length)];
        sendTelegramPost(nextDeal);
    }, 3 * 60 * 60 * 1000);
}

// تشغيل البوت
startAutoPoster();
