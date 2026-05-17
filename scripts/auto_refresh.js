/**
 * DealZone - Auto Refresh Script
 * يشتغل تلقائياً كل 6 ساعات عبر GitHub Actions
 * وظيفته: قراءة deals_catalog.json وتجديد database_v3.js بتواريخ انتهاء جديدة
 *
 * لإضافة منتج جديد: أضفه في deals_catalog.json فقط
 * لحذف منتج: احذفه من deals_catalog.json فقط
 * لا تحتاج لمس database_v3.js يدوياً أبداً
 */

const fs   = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '..', 'deals_catalog.json');
const DB_PATH      = path.join(__dirname, '..', 'database_v3.js');

// Helper: random expiry time in the future
function getFutureTime(hoursToAdd) {
    const d = new Date();
    d.setHours(d.getHours() + hoursToAdd);
    return d.getTime();
}

// Randomize expiry ±25% of base to keep timers feeling fresh/different
function jitterExpiry(baseHours) {
    const jitter = Math.floor(baseHours * 0.25 * (Math.random() - 0.5) * 2);
    return Math.max(6, baseHours + jitter);
}

function run() {
    console.log(`\n🤖 DealZone Auto-Refresh — ${new Date().toUTCString()}`);
    console.log('━'.repeat(50));

    // 1. Read catalog
    if (!fs.existsSync(CATALOG_PATH)) {
        console.error('❌ deals_catalog.json not found!');
        process.exit(1);
    }
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    console.log(`📦 Catalog loaded: ${catalog.length} products`);

    // 2. Build realDeals array with fresh expiresAt timestamps
    const realDeals = catalog.map(p => ({
        id:              p.id,
        title:           p.title,
        image:           p.image,
        oldPrice:        p.oldPrice,
        newPrice:        p.newPrice,
        currency:        p.currency,
        competitorPrice: p.competitorPrice,
        store:           p.store,
        storeIcon:       p.storeIcon,
        category:        p.category,
        location:        p.location,
        flag:            p.flag,
        link:            p.link,
        expiresAt:       getFutureTime(jitterExpiry(p.expiresHours || 48)),
        isHot:           p.isHot || false,
        savingNote:      p.savingNote || ''
    }));

    // 3. Generate the realDeals JS block
    const dealsBlock = `const realDeals = ${JSON.stringify(realDeals, null, 4)};`;

    // 4. Read current DB file and replace realDeals section
    if (!fs.existsSync(DB_PATH)) {
        console.error('❌ database_v3.js not found!');
        process.exit(1);
    }
    let dbContent = fs.readFileSync(DB_PATH, 'utf8');

    // Update last-refresh timestamp comment
    const nowStr = new Date().toISOString();
    dbContent = dbContent.replace(
        /\/\/ آخر تحديث تلقائي:.*\n/,
        `// آخر تحديث تلقائي: ${nowStr}\n`
    );

    // Replace the realDeals array
    const regex = /const realDeals\s*=\s*\[[\s\S]*?\];/;
    if (!regex.test(dbContent)) {
        console.error('❌ Could not find realDeals array in database_v3.js');
        process.exit(1);
    }
    dbContent = dbContent.replace(regex, dealsBlock);

    // 5. Write back
    fs.writeFileSync(DB_PATH, dbContent, 'utf8');

    console.log(`✅ database_v3.js refreshed with ${realDeals.length} deals`);
    console.log(`⏰ Timestamps updated at ${nowStr}`);
    console.log('━'.repeat(50));
    console.log('🚀 GitHub Actions will deploy automatically!\n');
}

run();
