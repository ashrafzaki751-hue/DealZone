// --- Configuration & State ---
const translations = {
    ar: {
        nav_home: "الرئيسية", nav_deals: "أقوى العروض", nav_coupon: "🎁 احصل على كوبون",
        trust_badge: "💯 موقع موثوق وآمن", hero_title: "اكتشف أفضل الصفقات حول العالم!",
        hero_desc: "نجمع لك التخفيضات اليومية من المتاجر الكبرى لنضمن لك التوفير والجودة. تسوق بأمان من أي مكان.",
        filter_all: "كل الدول", filter_egypt: "مصر", filter_ksa: "السعودية", filter_global: "عالمي",
        deal_of_day: "عرض الفلاش ⚡", smartwatch_title: "ساعة ذكية رياضية (Apple Watch Clone)",
        section_title: "عروض الفلاش ⚡", section_desc: "تخفيضات حصرية تنتهي قريباً، اقتنصها الآن قبل نفاذ الكمية!",
        cat_all: "الكل", cat_tech: "إلكترونيات", cat_fashion: "أزياء رجالية", cat_women: "عالم المرأة",
        cat_beauty: "عطور وتجميل", cat_kids: "ألعاب وأطفال", cat_books: "كتب وثقافة", cat_home: "مستلزمات المنزل",
        get_deal: "اذهب للمتجر", price_old: "سعر السوق", price_new: "عرض حصري", discount: "خصم",
        viral_title: "انتظر! كوبون خصم 10$ 💸", viral_desc: "شارك DealZone مع 3 أصدقاء على الواتساب لفتح الكوبون الحصري فوراً!",
        viral_shares: "مشاركات", viral_btn: "مشاركة عبر الواتساب", viral_success: "مبروك! الكود الخاص بك:",
        footer_desc: "دليلك الموثوق لأفضل العروض العالمية والمحلية. تسوق ممتع وآمن.",
        footer_links: "روابط هامة", link_privacy: "سياسة الخصوصية", link_terms: "شروط الاستخدام", link_contact: "اتصل بنا",
        footer_copyright: "جميع الحقوق محفوظة.", search_ph: "ابحث عن منتج، علامة تجارية...",
        ends_in: "ينتهي العرض خلال", redirecting: "جاري نقلك بأمان عبر الرابط المخصص إلى"
    },
    en: {
        nav_home: "Home", nav_deals: "Top Deals", nav_coupon: "🎁 Get a Coupon",
        trust_badge: "💯 Trusted & Secure", hero_title: "Discover Global Flash Deals!",
        hero_desc: "We curate the best daily discounts from major stores to ensure top quality and savings.",
        filter_all: "All Regions", filter_egypt: "Egypt", filter_ksa: "KSA", filter_global: "Global",
        deal_of_day: "Flash Deal ⚡", smartwatch_title: "Advanced Sport Smartwatch",
        section_title: "Flash Deals ⚡", section_desc: "Exclusive discounts ending soon. Grab them before they're gone!",
        cat_all: "All", cat_tech: "Electronics", cat_fashion: "Men's Fashion", cat_women: "Women",
        cat_beauty: "Beauty & Perfumes", cat_kids: "Kids & Toys", cat_books: "Books & Culture", cat_home: "Home",
        get_deal: "Go to Store", price_old: "Market Price", price_new: "Exclusive", discount: "OFF",
        viral_title: "Wait! Win a $10 Coupon 💸", viral_desc: "Share DealZone with 3 friends on WhatsApp to unlock your coupon instantly!",
        viral_shares: "shares", viral_btn: "Share on WhatsApp", viral_success: "Congrats! Your code:",
        footer_desc: "Your trusted guide to global deals. Happy shopping.",
        footer_links: "Important Links", link_privacy: "Privacy Policy", link_terms: "Terms of Use", link_contact: "Contact Us",
        footer_copyright: "All Rights Reserved.", search_ph: "Search for a product or brand...",
        ends_in: "Ends in", redirecting: "Redirecting you securely to"
    }
};

let currentLang = 'ar';
let currentCategory = 'all';
let currentLocation = 'all';
let searchQuery = '';
let sharesCount = 0;
let hasShownExitIntent = false;

// DOM Elements
const htmlDoc = document.getElementById('html-doc');
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const toastContainer = document.getElementById('toast-container');
const themeToggle = document.getElementById('theme-toggle');

// --- Initialization ---
function init() {
    if (window.DB) window.DB.recordVisit();
    setupTheme();
    setupLanguage();
    setupFilters();
    setupSearch();
    setupExitIntent();
    setupViralLoop();
    
    // Initial Render with Skeleton Loader Simulation
    renderSkeletons();
    setTimeout(() => {
        renderDeals();
        startCountdowns();
        showToast("مرحباً بك في منصة DealZone! تم تحديث العروض بنجاح.", "success");
    }, 1500);
}

// --- Theme Management ---
function setupTheme() {
    const savedTheme = localStorage.getItem('dz_theme') || 'light';
    htmlDoc.setAttribute('data-theme', savedTheme);
    themeToggle.innerText = savedTheme === 'light' ? '🌙' : '☀️';
    
    themeToggle.addEventListener('click', () => {
        const current = htmlDoc.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        htmlDoc.setAttribute('data-theme', next);
        themeToggle.innerText = next === 'light' ? '🌙' : '☀️';
        localStorage.setItem('dz_theme', next);
    });
}

// --- Language Management ---
function setLanguage(lang) {
    currentLang = lang;
    htmlDoc.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    htmlDoc.setAttribute('lang', lang);
    document.getElementById('lang-ar').classList.toggle('active', lang === 'ar');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerHTML = translations[lang][key];
    });
    
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[lang][key]) el.setAttribute('placeholder', translations[lang][key]);
    });
    
    renderDeals();
}
function setupLanguage() {
    document.getElementById('lang-ar').addEventListener('click', () => setLanguage('ar'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));
    setLanguage(currentLang);
}

// --- Toast Notifications ---
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// --- Skeletons & Rendering ---
function renderSkeletons() {
    productGrid.innerHTML = '';
    for(let i=0; i<8; i++) {
        productGrid.innerHTML += `
            <div class="deal-card">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width:60%"></div>
                <div class="skeleton skeleton-btn"></div>
            </div>`;
    }
}

function renderDeals() {
    if (!window.DB) return;
    productGrid.innerHTML = '';
    const t = translations[currentLang];
    
    let deals = window.DB.getDeals();
    
    // Filters
    if (currentLocation !== 'all') {
        deals = currentLocation === 'global' ? deals.filter(d => ['global','usa'].includes(d.location)) : deals.filter(d => d.location === currentLocation);
    }
    if (currentCategory !== 'all') deals = deals.filter(d => d.category === currentCategory);
    if (searchQuery) {
        deals = deals.filter(d => d.title.toLowerCase().includes(searchQuery) || d.store.toLowerCase().includes(searchQuery));
    }
    
    if (deals.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">لا توجد نتائج مطابقة.</p>`;
        return;
    }
    
    deals.forEach(deal => {
        const discountPct = Math.round(((deal.oldPrice - deal.newPrice) / deal.oldPrice) * 100);
        const card = document.createElement('div');
        card.className = 'deal-card';
        card.innerHTML = `
            <div class="deal-image-container">
                <div class="deal-badge">${t.discount} ${discountPct}% 🔥</div>
                <div style="position: absolute; top: 10px; left: 10px; font-size: 1.5rem; background: var(--glass-bg); border-radius: 50%; padding: 2px;">${deal.flag}</div>
                <img src="${deal.image}" alt="${deal.title}" class="deal-image">
                <div class="store-badge">${deal.storeIcon} ${deal.store}</div>
            </div>
            <div class="deal-info">
                <h3 class="deal-title" style="text-align: ${currentLang==='ar'?'right':'left'}">${deal.title}</h3>
                <div class="countdown" data-expires="${deal.expiresAt}">${t.ends_in} <span class="time-str">--:--:--</span></div>
                <div class="price-box" style="flex-direction: ${currentLang==='ar'?'row':'row-reverse'}">
                    <div class="old-price-container">
                        <span class="price-label">${t.price_old}</span>
                        <span class="old-price">$${deal.oldPrice.toFixed(2)}</span>
                    </div>
                    <div class="new-price-container">
                        <span class="price-label">${t.price_new}</span>
                        <span class="new-price">$${deal.newPrice.toFixed(2)}</span>
                    </div>
                </div>
                <button class="btn btn-store w-100" onclick="goToDeal('${deal.store}')">${t.get_deal}</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// --- Advanced Features ---
function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentCategory = e.currentTarget.getAttribute('data-cat');
            renderDeals();
        });
    });
    document.querySelectorAll('.geo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.geo-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentLocation = e.currentTarget.getAttribute('data-loc');
            renderDeals();
        });
    });
}

function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderDeals();
    });
}

function startCountdowns() {
    setInterval(() => {
        const now = new Date().getTime();
        document.querySelectorAll('.countdown').forEach(el => {
            const expires = parseInt(el.getAttribute('data-expires'));
            const distance = expires - now;
            if (distance < 0) {
                el.querySelector('.time-str').innerHTML = "انتهى العرض!";
                return;
            }
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            el.querySelector('.time-str').innerHTML = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        });
    }, 1000);
}

// --- Exit Intent & Viral Popup ---
const popup = document.getElementById('viral-popup');
function setupExitIntent() {
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !hasShownExitIntent) {
            hasShownExitIntent = true;
            popup.classList.add('active');
            showToast(currentLang === 'ar' ? 'لدينا هدية لك قبل أن تذهب!' : 'We have a gift before you leave!');
        }
    });
}

function setupViralLoop() {
    const closeBtn = document.getElementById('close-popup');
    const viralBtn = document.getElementById('viral-btn');
    const shareBtn = document.getElementById('share-whatsapp-btn');
    const progress = document.getElementById('share-progress');
    const count = document.getElementById('share-count');
    const couponBox = document.getElementById('coupon-box');

    viralBtn.addEventListener('click', (e) => { e.preventDefault(); popup.classList.add('active'); });
    closeBtn.addEventListener('click', () => popup.classList.remove('active'));

    shareBtn.addEventListener('click', () => {
        const msg = currentLang === 'ar' ? `اكتشفت موقع خرافي للعروض! https://dealzone.com` : `Amazing deals here: https://dealzone.com`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        
        setTimeout(() => {
            if (sharesCount < 3) {
                sharesCount++;
                count.innerText = sharesCount;
                progress.style.width = `${(sharesCount / 3) * 100}%`;
                if (sharesCount === 3) {
                    shareBtn.classList.add('hidden');
                    couponBox.classList.remove('hidden');
                    showToast(currentLang==='ar'?'تم تفعيل الكوبون بنجاح!':'Coupon activated successfully!', 'success');
                }
            }
        }, 2000);
    });
}

window.goToDeal = function(store) {
    if (window.DB) window.DB.recordClick();
    const t = translations[currentLang];
    showToast(`${t.redirecting} ${store} 🚀`, 'success');
}

document.addEventListener('DOMContentLoaded', init);
