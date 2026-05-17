/**
 * DealZone - Catalog Refresh Bot (deal_bot.js)
 * بوت تحديث قاعدة البيانات باستخدام منتجات حقيقية مضافة يدوياً
 * لا يحتاج لـ scraping أو API - فقط اكتب المنتج وشغّل الأمر
 * 
 * كيف تستخدمه:
 * 1. أضف منتجاً جديداً في قائمة newDealsToAdd أدناه
 * 2. شغّل: node deal_bot.js
 * 3. شغّل sync_dealzone.bat لرفع التحديث
 */

const fs = require('fs');
const DB_FILE_PATH = './database_v3.js';

const AMAZON_TAG = 'ashraf0b6-20';
const NOON_TAG = 'C1000264L';

// ==========================================
// أضف منتجاتك الجديدة هنا ⬇️
// ==========================================
const newDealsToAdd = [
    {
        id: "new_deal_1",
        title: "اكتب اسم المنتج هنا",
        image: "https://m.media-amazon.com/images/I/XXXXXXX.jpg", // صورة المنتج من أمازون
        oldPrice: 1000,    // السعر القديم بالجنيه
        newPrice: 800,     // السعر الجديد
        currency: "EGP",
        competitorPrice: 950,
        store: "Amazon Egypt",
        storeIcon: "📦",
        category: "tech", // tech / home / beauty / kids / books / fashion / women
        location: "egypt",
        flag: "🇪🇬",
        link: `https://www.amazon.eg/dp/ASIN_HERE/?tag=${AMAZON_TAG}`,
        expiresHours: 48, // بعد كام ساعة ينتهي العرض
        isHot: true,
        savingNote: "اكتب جملة التوفير هنا"
    }
    // يمكنك إضافة أكثر من منتج هنا ...
];
// ==========================================

function getFutureTime(hoursToAdd) {
    const d = new Date();
    d.setHours(d.getHours() + hoursToAdd);
    return d.getTime();
}

function buildDealEntry(deal) {
    return {
        id: deal.id,
        title: deal.title,
        image: deal.image,
        oldPrice: deal.oldPrice,
        newPrice: deal.newPrice,
        currency: deal.currency,
        competitorPrice: deal.competitorPrice,
        store: deal.store,
        storeIcon: deal.storeIcon,
        category: deal.category,
        location: deal.location,
        flag: deal.flag,
        link: deal.link,
        expiresAt: getFutureTime(deal.expiresHours || 48),
        isHot: deal.isHot || false,
        savingNote: deal.savingNote || ""
    };
}

function updateDatabase() {
    console.log('🤖 DealZone Bot - بدء تحديث قاعدة البيانات...');
    
    if (newDealsToAdd.length === 0 || newDealsToAdd[0].id === 'new_deal_1') {
        console.log('⚠️  لم تضف أي منتجات جديدة بعد!');
        console.log('👉 افتح deal_bot.js وأضف منتجاتك في قائمة newDealsToAdd');
        return;
    }
    
    let dbContent = fs.readFileSync(DB_FILE_PATH, 'utf8');
    
    const newDeals = newDealsToAdd.map(buildDealEntry);
    let addedCount = 0;
    
    newDeals.forEach(deal => {
        // تحقق أن المنتج مش موجود بالفعل
        if (dbContent.includes(`id: "${deal.id}"`)) {
            console.log(`⏩ تخطي: ${deal.title} (موجود بالفعل)`);
            return;
        }
        
        const dealString = `    ${JSON.stringify(deal, null, 4).replace(/\n/g, '\n    ')},`;
        
        // إضافة المنتج قبل آخر ] في realDeals
        const insertMarker = '    {\n        id: "braun_epil_9';
        if (dbContent.includes(insertMarker)) {
            dbContent = dbContent.replace(
                insertMarker,
                `${dealString}\n    {\n        id: "braun_epil_9`
            );
            addedCount++;
            console.log(`✅ تمت إضافة: ${deal.title}`);
        }
    });
    
    if (addedCount > 0) {
        fs.writeFileSync(DB_FILE_PATH, dbContent);
        console.log(`\n🎉 تم إضافة ${addedCount} منتج جديد بنجاح!`);
        console.log('👉 الآن شغّل: sync_dealzone.bat لرفع التحديثات');
    } else {
        console.log('ℹ️  لم يتم إضافة أي منتجات جديدة.');
    }
}

updateDatabase();
