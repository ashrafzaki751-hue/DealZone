// DealZone Dashboard Logic - Real-Time Data Connection

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (sessionStorage.getItem('dealzone_auth') === 'true') {
        document.getElementById('login-overlay').style.display = 'none';
    }

    updateDashboardStats();
    startLiveRadar();
    
    // Update stats every 5 seconds
    setInterval(updateDashboardStats, 5000);
});

function checkAuth() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorEl = document.getElementById('auth-error');

    if (user === 'admin' && pass === 'ashraf2950') {
        sessionStorage.setItem('dealzone_auth', 'true');
        document.getElementById('login-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('login-overlay').style.display = 'none';
        }, 500);
    } else {
        errorEl.style.display = 'block';
        setTimeout(() => { errorEl.style.display = 'none'; }, 3000);
    }
}

function updateDashboardStats() {
    const stats = window.DB.getStats();
    
    const visitsEl = document.getElementById('total-visits');
    const clicksEl = document.getElementById('total-clicks');
    const profitEl = document.getElementById('est-profit');
    
    if (visitsEl) visitsEl.innerText = stats.totalVisitors.toLocaleString();
    if (clicksEl) clicksEl.innerText = stats.totalClicks.toLocaleString();
    if (profitEl) profitEl.innerText = `$${stats.estimatedRevenue.toFixed(2)}`;
}

function startLiveRadar() {
    const locations = ['القاهرة', 'الرياض', 'دبي', 'جدة', 'الإسكندرية', 'الكويت', 'الدوحة', 'عمان', 'لندن', 'نيويورك'];
    const locEl = document.getElementById('current-location');
    
    setInterval(() => {
        const randomLoc = locations[Math.floor(Math.random() * locations.length)];
        if (locEl) {
            locEl.style.opacity = 0;
            setTimeout(() => {
                locEl.innerText = randomLoc + '...';
                locEl.style.opacity = 1;
            }, 500);
        }
    }, 4000);
}

// Simulated real-time interaction for the dashboard
window.addEventListener('statsUpdated', updateDashboardStats);
