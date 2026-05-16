// المحرك الخلفي وقاعدة البيانات الاحترافية V3 (Mega Expansion)

const DB_KEY = 'trend_deals_db_v3';
const STATS_KEY = 'trend_stats_db_v3';

// Generate a future date for countdowns
function getFutureTime(hoursToAdd) {
    const d = new Date();
    d.setHours(d.getHours() + hoursToAdd);
    return d.getTime();
}

// Mega Global & Local Deals Collection
const initialDeals = [
    // Tech & Electronics
    { id: 1, title: "لابتوب أبل ماك بوك برو M3", image: "https://via.placeholder.com/300x250?text=MacBook+Pro", oldPrice: 1999.00, newPrice: 1750.00, store: "Amazon US", storeIcon: "📦", category: "tech", location: "usa", flag: "🇺🇸", expiresAt: getFutureTime(5) },
    { id: 2, title: "ساعة ذكية رياضية تتبع النبض", image: "assets/smartwatch.png", oldPrice: 120.00, newPrice: 49.99, store: "AliExpress", storeIcon: "🛒", category: "tech", location: "global", flag: "🌐", expiresAt: getFutureTime(12) },
    { id: 3, title: "سماعات أبل AirPods Pro", image: "assets/earbuds.png", oldPrice: 249.00, newPrice: 189.00, store: "Amazon KSA", storeIcon: "📦", category: "tech", location: "ksa", flag: "🇸🇦", expiresAt: getFutureTime(24) },
    
    // Men's Fashion
    { id: 4, title: "جاكيت جلد أسود فاخر للرجال", image: "assets/jacket.png", oldPrice: 200.00, newPrice: 85.00, store: "Trendyol", storeIcon: "👚", category: "fashion", location: "global", flag: "🌐", expiresAt: getFutureTime(48) },
    { id: 5, title: "حذاء نايكي أير جوردن الأصلي", image: "assets/sneakers.png", oldPrice: 180.00, newPrice: 110.00, store: "Amazon Global", storeIcon: "📦", category: "fashion", location: "global", flag: "🌐", expiresAt: getFutureTime(4) },
    
    // Women's Fashion & Beauty
    { id: 6, title: "حقيبة يد نسائية ماركة لويس فيتون (أصلية)", image: "https://via.placeholder.com/300x250/ffe4e1/000000?text=LV+Bag", oldPrice: 1500.00, newPrice: 999.00, store: "Farfetch", storeIcon: "👜", category: "women", location: "global", flag: "🌐", expiresAt: getFutureTime(1) },
    { id: 7, title: "مجموعة مكياج وهدايا العناية بالبشرة", image: "https://via.placeholder.com/300x250/ffb6c1/000?text=Skincare", oldPrice: 85.00, newPrice: 40.00, store: "Sephora", storeIcon: "💄", category: "beauty", location: "global", flag: "🌐", expiresAt: getFutureTime(7) },
    { id: 8, title: "عطر شانيل N°5 الكلاسيكي", image: "https://via.placeholder.com/300x250/fdf5e6/000?text=Perfume", oldPrice: 150.00, newPrice: 110.00, store: "Noon KSA", storeIcon: "🟡", category: "beauty", location: "ksa", flag: "🇸🇦", expiresAt: getFutureTime(15) },

    // Kids & Toys
    { id: 9, title: "مجموعة ليجو ستار وورز الكبيرة", image: "https://via.placeholder.com/300x250/add8e6/000?text=Lego+Set", oldPrice: 120.00, newPrice: 79.99, store: "Amazon Egypt", storeIcon: "📦", category: "kids", location: "egypt", flag: "🇪🇬", expiresAt: getFutureTime(3) },
    { id: 10, title: "ملابس أطفال قطنية طقم كامل", image: "https://via.placeholder.com/300x250/ffffe0/000?text=Kids+Clothes", oldPrice: 45.00, newPrice: 20.00, store: "Jumia Egypt", storeIcon: "🛍️", category: "kids", location: "egypt", flag: "🇪🇬", expiresAt: getFutureTime(20) },

    // Books & Intellectuals
    { id: 11, title: "جهاز كيندل (Kindle) للقراءة الإلكترونية", image: "https://via.placeholder.com/300x250/d3d3d3/000?text=Kindle", oldPrice: 139.00, newPrice: 99.00, store: "Amazon US", storeIcon: "📦", category: "books", location: "usa", flag: "🇺🇸", expiresAt: getFutureTime(8) },
    { id: 12, title: "مجموعة كتب تطوير الذات (5 كتب)", image: "https://via.placeholder.com/300x250/f5deb3/000?text=Books+Bundle", oldPrice: 60.00, newPrice: 25.00, store: "Noon Egypt", storeIcon: "🟡", category: "books", location: "egypt", flag: "🇪🇬", expiresAt: getFutureTime(18) },

    // Home & Living
    { id: 13, title: "قلاية هوائية فيليبس XXL", image: "https://via.placeholder.com/300x250/e6e6fa/000?text=Air+Fryer", oldPrice: 250.00, newPrice: 149.00, store: "Noon KSA", storeIcon: "🟡", category: "home", location: "ksa", flag: "🇸🇦", expiresAt: getFutureTime(2) },
    { id: 14, title: "مصباح مكتب ذكي لاسلكي", image: "assets/lamp.png", oldPrice: 45.00, newPrice: 22.00, store: "Noon Egypt", storeIcon: "🟡", category: "home", location: "egypt", flag: "🇪🇬", expiresAt: getFutureTime(6) },
    
    // Outdoors / Travel
    { id: 15, title: "حقيبة ظهر للسفر مقاومة للماء", image: "assets/backpack.png", oldPrice: 65.00, newPrice: 35.00, store: "Jumia", storeIcon: "🛍️", category: "fashion", location: "egypt", flag: "🇪🇬", expiresAt: getFutureTime(10) }
];

// Initial Stats
const initialStats = {
    totalVisitors: 8420,
    totalClicks: 1290,
    estimatedRevenue: 185.00,
    conversionRate: 0.15 
};

// --- Database Operations ---
function getDeals() {
    let deals = localStorage.getItem(DB_KEY);
    if (!deals) {
        localStorage.setItem(DB_KEY, JSON.stringify(initialDeals));
        return initialDeals;
    }
    deals = JSON.parse(deals);
    
    const now = new Date().getTime();
    let updated = false;
    deals.forEach(d => {
        if (now > d.expiresAt) {
            d.expiresAt = getFutureTime(Math.floor(Math.random() * 24) + 1);
            updated = true;
        }
    });
    if (updated) localStorage.setItem(DB_KEY, JSON.stringify(deals));
    
    return deals;
}

function getStats() {
    const stats = localStorage.getItem(STATS_KEY);
    if (!stats) {
        localStorage.setItem(STATS_KEY, JSON.stringify(initialStats));
        return initialStats;
    }
    return JSON.parse(stats);
}

function saveStats(stats) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function recordVisit() {
    const stats = getStats();
    stats.totalVisitors += Math.floor(Math.random() * 5) + 1; 
    saveStats(stats);
}

function recordClick() {
    const stats = getStats();
    stats.totalClicks += 1;
    if (Math.random() <= stats.conversionRate) {
        stats.estimatedRevenue += 2.50;
    }
    saveStats(stats);
}

// --- AI Bot Simulation ---
function runAIBot() {
    const stats = getStats();
    stats.totalVisitors += Math.floor(Math.random() * 12);
    if (Math.random() > 0.4) {
        stats.totalClicks += Math.floor(Math.random() * 3);
        if (Math.random() <= stats.conversionRate) {
            stats.estimatedRevenue += 1.50;
        }
    }
    saveStats(stats);
    window.dispatchEvent(new Event('statsUpdated'));
}

setInterval(runAIBot, 4000);

window.DB = { getDeals, getStats, recordVisit, recordClick };
