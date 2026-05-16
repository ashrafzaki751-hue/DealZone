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
        ends_in: "ينتهي العرض خلال", redirecting: "جاري نقلك بأمان عبر الرابط المخصص إلى", load_more: "⬇️ تحميل المزيد من العروض", loaded_all: "عظيم! لقد تصفحت كل العروض في هذا القسم.",
        affiliate_disclosure: "بصفتنا مسوقين بالعمولة، قد نحصل على عمولة صغيرة عند الشراء من خلال روابطنا، وهذا لا يكلفك أي رسوم إضافية. شكراً لدعمكم!"
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
        ends_in: "Ends in", redirecting: "Redirecting you securely to", load_more: "⬇️ Load More Deals", loaded_all: "Awesome! You've browsed all deals in this category.",
        affiliate_disclosure: "As an Amazon Associate, DealZone earns from qualifying purchases. This helps us keep the site free for you."
    }
};

let currentLang = 'ar';
let currentCategory = 'all';
let currentLocation = 'all';
let searchQuery = '';
let sharesCount = 0;
let hasShownExitIntent = false;

// Pagination State
let currentPage = 1;
const itemsPerPage = 20;
let currentDealsList = [];

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
    
    document.getElementById('load-more-btn').addEventListener('click', () => {
        currentPage++;
        renderDeals(true);
    });
    
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

function renderDeals(append = false) {
    if (!window.DB) return;
    const t = translations[currentLang];
    const loadBtn = document.getElementById('load-more-btn');
    
    if (!append) {
        productGrid.innerHTML = '';
        currentPage = 1;
        let deals = window.DB.getDeals();
        
        // Filters
        if (currentLocation !== 'all') {
            deals = currentLocation === 'global' ? deals.filter(d => ['global','usa'].includes(d.location)) : deals.filter(d => d.location === currentLocation);
        }
        if (currentCategory !== 'all') deals = deals.filter(d => d.category === currentCategory);
        if (searchQuery) {
            const q = searchQuery.trim().toLowerCase();
            deals = deals.filter(d => 
                d.title.toLowerCase().includes(q) || 
                d.store.toLowerCase().includes(q) || 
                d.category.toLowerCase().includes(q)
            );
        }
        currentDealsList = deals;
    }
    
    if (currentDealsList.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center;">لا توجد نتائج مطابقة.</p>`;
        if(loadBtn) loadBtn.style.display = 'none';
        return;
    }
    
    if(loadBtn) loadBtn.style.display = 'inline-block';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dealsToShow = currentDealsList.slice(startIndex, endIndex);
    
    dealsToShow.forEach(deal => {
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
                <div class="stock-alert">⚠️ باقي 3 قطع فقط! / Low Stock</div>
                <h3 class="deal-title" style="text-align: ${currentLang==='ar'?'right':'left'}">${deal.title}</h3>
                <div class="price-comparison">
                    <span>${deal.store}: <strong>${(deal.newPrice || 0).toFixed(2)} ${deal.currency || '$'}</strong></span>
                    <span style="opacity:0.6; text-decoration: line-through; font-size:0.8rem">المنافسين: ${(deal.competitorPrice || 0).toFixed(2)} ${deal.currency || '$'}</span>
                </div>
                <div class="countdown" data-expires="${deal.expiresAt}">${t.ends_in} <span class="time-str">--:--:--</span></div>
                <div class="price-box" style="flex-direction: ${currentLang==='ar'?'row':'row-reverse'}">
                    <div class="old-price-container">
                        <span class="price-label">السعر الأصلي</span>
                        <span class="old-price">${(deal.oldPrice || 0).toFixed(2)} ${deal.currency || '$'}</span>
                    </div>
                    <div class="new-price-container">
                        <span class="price-label">وفرت ${discountPct}%</span>
                        <span class="new-price">${(deal.newPrice || 0).toFixed(2)} ${deal.currency || '$'}</span>
                    </div>
                </div>
                <button class="btn btn-store w-100" onclick="goToDeal(${deal.id})">${t.get_deal}</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
    
    if (endIndex >= currentDealsList.length) {
        if(loadBtn) {
            loadBtn.innerText = t.loaded_all;
            loadBtn.disabled = true;
            loadBtn.style.background = 'var(--text-muted)';
        }
    } else {
        if(loadBtn) {
            loadBtn.innerText = t.load_more;
            loadBtn.disabled = false;
            loadBtn.style.background = '';
        }
    }
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

    // Sidebar Category Clicks
    document.querySelectorAll('.side-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.side-item').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentCategory = e.currentTarget.getAttribute('data-cat');
            
            // مزامنة مع الفلاتر العلوية لو وجدت
            document.querySelectorAll('.filter-btn').forEach(fb => {
                fb.classList.toggle('active', fb.getAttribute('data-cat') === currentCategory);
            });

            renderDeals();
            
            // الانتقال لقسم العروض تلقائياً
            document.getElementById('deals').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderDeals();
    });
    
    // دعم الضغط على Enter للبحث الرسمي
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            renderDeals();
            searchInput.blur();
            showToast(currentLang==='ar'?'جاري البحث عن أفضل النتائج...':'Searching for best results...', 'success');
        }
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
        const msg = currentLang === 'ar' ? `اكتشفت موقع خرافي للعروض! https://ashrafzaki751-hue.github.io/DealZone/` : `Amazing deals here: https://ashrafzaki751-hue.github.io/DealZone/`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
        
        setTimeout(() => {
            if (sharesCount < 5) {
                sharesCount++;
                count.innerText = sharesCount;
                progress.style.width = `${(sharesCount / 5) * 100}%`;
                if (sharesCount === 5) {
                    shareBtn.classList.add('hidden');
                    showToast(currentLang==='ar'?'تم تفعيل الجائزة! تواصل مع الدعم لاستلامها.':'Prize activated! Contact support to claim.', 'success');
                }
            }
        }, 2000);
    });
}

window.goToDeal = function(dealId) {
    const deals = window.DB.getDeals();
    const deal = deals.find(d => String(d.id) === String(dealId));
    if (!deal) return;

    if (window.DB) window.DB.recordClick();
    const t = translations[currentLang];
    
    // 1. Direct Affiliate Link (The most important for real deals)
    let targetUrl = deal.link;

    // 2. Fallback Search-based Link (For legacy or dynamic deals)
    if (!targetUrl) {
        const tags = {
            amazon: "ashraf0b6-20",
            noon: "C1000264L",
            aliexpress: "YOUR_ALI_ID" 
        };
        const store = deal.store.toLowerCase();
        if (store.includes("amazon")) {
            targetUrl = `https://www.amazon.eg/s?k=${encodeURIComponent(deal.title)}&tag=${tags.amazon}`;
        } else if (store.includes("noon")) {
            targetUrl = `https://www.noon.com/search/?q=${encodeURIComponent(deal.title)}&utm_source=${tags.noon}`;
        } else {
            targetUrl = `https://www.google.com/search?q=${encodeURIComponent(deal.title + " " + deal.store)}`;
        }
    }

    showToast(`${t.redirecting} ${deal.store} 🚀`, 'success');
    
    // Immediate professional redirection to maximize affiliate conversion
    if (window.trackClick) window.trackClick();
    window.location.href = targetUrl;
}

// --- Social Proof Bot Logic ---
function runSocialProofBot() {
    const spPopup = document.getElementById('social-proof');
    const spUser = document.getElementById('sp-user');
    const spAction = document.getElementById('sp-action');
    
    const names = ["أحمد", "سارة", "محمد", "فهد", "ليلى", "عمر", "خالد", "نورة", "عبدالرحمن", "ياسمين", "John", "Sarah", "Mike"];
    const citiesAr = ["القاهرة", "الرياض", "دبي", "جدة", "الإسكندرية", "الكويت", "الدوحة", "عمان"];
    const citiesEn = ["Cairo", "Riyadh", "Dubai", "Jeddah", "Alexandria", "Kuwait", "Doha", "Amman"];
    const actionsAr = ["اشترى لابتوب الآن!", "حصل على كوبون خصم 20$", "اقتنص عرض الفلاش ⚡", "أضاف منتجاً للسلة 🛒"];
    const actionsEn = ["just bought a laptop!", "unlocked a $20 coupon", "grabbed a flash deal ⚡", "added an item to cart 🛒"];

    setInterval(() => {
        if (Math.random() > 0.6) {
            const isAr = currentLang === 'ar';
            const name = names[Math.floor(Math.random() * names.length)];
            const city = isAr ? citiesAr[Math.floor(Math.random() * citiesAr.length)] : citiesEn[Math.floor(Math.random() * citiesEn.length)];
            const action = isAr ? actionsAr[Math.floor(Math.random() * actionsAr.length)] : actionsEn[Math.floor(Math.random() * actionsEn.length)];
            
            spUser.innerText = `${name} (${city})`;
            spAction.innerText = action;
            
            spPopup.classList.add('active');
            setTimeout(() => spPopup.classList.remove('active'), 5000);
        }
    }, 12000); // تظهر كل 12 ثانية تقريباً
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    runSocialProofBot();
    
    // --- Magic Ad Button (Direct Link) ---
    const magicBtn = document.getElementById('magic-ad-btn');
    if (magicBtn) {
        magicBtn.addEventListener('click', () => {
            // الرابط الحقيقي الخاص بك من Adsterra لجمع الأرباح
            const adsterraDirectLink = "https://www.profitablecpmratenetwork.com/u0cnvdq1h?key=4d99b9b4b401e1d93913496e93fdb5f7"; 
            window.open(adsterraDirectLink, '_blank');
            showToast("🎁 جاري جلب العرض الحصري لك...", "success");
        });
    }

    // --- Flash Timer Logic ---
    function startFlashTimer() {
        let timeLeft = 300; // 5 minutes
        const timerEl = document.getElementById('flash-timer');
        if (!timerEl) return;
        
        setInterval(() => {
            if (timeLeft <= 0) timeLeft = 300; 
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            timerEl.innerText = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
            timeLeft--;
        }, 1000);
    }
    startFlashTimer();

    // --- Auto-Indexing Pinger (Zero Intervention SEO) ---
    function autoPingIndexing() {
        const services = [
            'https://rpc.pingomatic.com/',
            'https://blogsearch.google.com/ping/RPC2',
            'https://rpc.twingly.com/',
            'https://api.my.yahoo.com/rss/ping?u=',
            'https://pubsubhubbub.appspot.com/publish'
        ];
        const siteUrl = 'https://ashrafzaki751-hue.github.io/DealZone/';
        services.forEach(service => {
            fetch(`${service}?url=${encodeURIComponent(siteUrl)}`, { mode: 'no-cors' }).catch(() => {});
        });
        console.log("SEO Traffic Magnet: Pinging global services...");
    }
    // محاكاة حركة الزوار الطبيعية (زيادة ونقصان)
    function updateLiveUsers() {
        const liveEl = document.getElementById('live-users');
        if (liveEl) {
            let current = parseInt(liveEl.innerText) || 500;
            // تذبذب طبيعي بين الزيادة والنقصان
            let change = Math.floor(Math.random() * 21) - 10; // من -10 لـ +10
            let next = current + change;
            if (next < 400) next = 400; // الحد الأدنى
            if (next > 700) next = 700; // الحد الأقصى
            liveEl.innerText = next;
        }
    }
    setInterval(updateLiveUsers, 8000); 

    // محاكاة ضغطات عالمية تلقائية لزيادة العداد طبيعياً
    setInterval(() => {
        let clicks = parseInt(localStorage.getItem('deal_clicks') || '0');
        // نفترض إن فيه 2-5 ضغطات بتحصل كل دقيقة من العالم كله
        localStorage.setItem('deal_clicks', clicks + Math.floor(Math.random() * 4) + 2);
        updateLiveRevenue();
    }, 45000); 

    // --- Optimized Smart Ad Trigger ---
    window.trackClick = function() {
        let clicks = parseInt(localStorage.getItem('deal_clicks') || '0');
        localStorage.setItem('deal_clicks', clicks + 1);
        updateLiveRevenue();
        
        // Trigger background ads on specific intervals to maximize profit without annoyance
        if ((clicks + 1) % 2 === 0) {
            console.log("Ad Logic: Optimization triggered.");
            // The pop-under script handles the actual launch, we just ensure interaction
        }
    };

    // Global Click Listener for Background Ads
    document.addEventListener('click', function(e) {
        // Trigger background ads only once per user interaction session
        if (!sessionStorage.getItem('ad_triggered')) {
            window.trackClick();
            sessionStorage.setItem('ad_triggered', 'true');
        }
    }, { once: false });

    function updateLiveRevenue() {
        let clicks = parseInt(localStorage.getItem('deal_clicks') || '0');
        const displayClicks = 12450 + clicks;
        const revenue = (displayClicks * 0.15).toFixed(2);
        
        const revEl = document.getElementById('est-revenue');
        const clickRadar = document.getElementById('total-clicks-radar');
        
        if (revEl) revEl.innerText = revenue;
        if (clickRadar) clickRadar.innerText = displayClicks;
    }

    // --- Social Signal Pinger (Crawler Bait) ---
    function pingSocialSignals() {
        const platforms = ['https://www.facebook.com/sharer/sharer.php?u=', 'https://twitter.com/intent/tweet?url=', 'https://www.pinterest.com/pin/create/button/?url='];
        const siteUrl = 'https://ashrafzaki751-hue.github.io/DealZone/';
        platforms.forEach(p => {
            fetch(`${p}${encodeURIComponent(siteUrl)}`, { mode: 'no-cors' }).catch(() => {});
        });
        console.log("Social Signals: Crawlers alerted!");
    }

    // --- Viral Secret Deals Logic ---
    let currentUnlockId = null;
    window.handleSecretUnlock = function(id) {
        currentUnlockId = id;
        document.getElementById('unlock-modal').classList.add('active');
        document.getElementById('share-progress').style.width = '0%';
    };

    const whatsappBtn = document.getElementById('whatsapp-share-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const siteUrl = 'https://ashrafzaki751-hue.github.io/DealZone/';
            const text = encodeURIComponent("🔥 الحق أقوى عروض السنه! أيفون 15 بـ 99 دولار بس في الخزنة السرية! ادخل افتح العرض من هنا: " + siteUrl);
            window.open(`https://wa.me/?text=${text}`, '_blank');
            
            // محاكاة التقدم
            let progress = 0;
            const interval = setInterval(() => {
                progress += 34;
                document.getElementById('share-progress').style.width = progress + '%';
                if (progress >= 100) {
                    clearInterval(interval);
                    showToast("🔓 تم فتح العرض بنجاح! استمتع بالتسوق.", "success");
                    document.getElementById('unlock-modal').classList.remove('active');
                    // إزالة القفل عن كل الكروت
                    document.querySelectorAll('.secret-card').forEach(card => {
                        card.classList.remove('locked');
                        const overlay = card.querySelector('.lock-overlay');
                        if (overlay) overlay.style.display = 'none';
                    });
                }
            }, 1000);
        });
    }

    window.handleNewsletter = function(e) {
        e.preventDefault();
        const email = document.getElementById('news-email').value;
        if (email) {
            showToast("🎁 تم الاشتراك بنجاح! تفقد بريدك قريباً.", "success");
            localStorage.setItem('subscriber_email', email);
            document.getElementById('news-email').value = '';
        }
    };

    // --- Halal Guard: Proactive Ad Filtering ---
    const inappropriateKeywords = ['sex', 'adult', 'dating', 'gamble', 'casino', 'bet', '🔞', 'kiss'];
    const adObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const content = node.innerText?.toLowerCase() || '';
                    if (inappropriateKeywords.some(kw => content.includes(kw))) {
                        node.style.display = 'none';
                        console.log("Halal Guard: Blocked inappropriate content.");
                    }
                }
            });
        });
    });
    adObserver.observe(document.body, { childList: true, subtree: true });

    // --- VIP Points Logic ---
    function addPoints(amount) {
        let points = parseInt(localStorage.getItem('vip_points') || '0');
        points += amount;
        localStorage.setItem('vip_points', points);
        updatePointsDisplay();
        showToast(`✨ حصلت على +${amount} نقطة!`, "success");
    }

    function updatePointsDisplay() {
        const pointsEl = document.getElementById('vip-points');
        if (pointsEl) {
            pointsEl.innerText = localStorage.getItem('vip_points') || '0';
        }
    }

    // Reward for WhatsApp Share
    const originalShare = whatsappBtn?.onclick;
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            // Logic for points after successful mock share
            setTimeout(() => addPoints(50), 2000);
        });
    }

    // Reward for Newsletter
    const originalNews = window.handleNewsletter;
    window.handleNewsletter = function(e) {
        e.preventDefault();
        const email = document.getElementById('news-email').value;
        if (email) {
            showToast("🎁 تم الاشتراك بنجاح! حصلت على 100 نقطة.", "success");
            addPoints(100);
            localStorage.setItem('subscriber_email', email);
            document.getElementById('news-email').value = '';
        }
    };

    updatePointsDisplay();
    autoPingIndexing();
    pingSocialSignals();
    updateLiveRevenue();
    updateLiveUsers();
});
