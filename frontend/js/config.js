/* ============================================================
   Raahi – Configuration
   ============================================================ */

const CONFIG = {
    API_BASE: 'http://localhost:8080/api',
    LOCATION_INTERVAL_MS: 10000,     // 10 seconds
    NEARBY_RADIUS_KM: 5,
    TOKEN_KEY: 'raahi_token',
    USER_KEY: 'raahi_user',
    OFFLINE_QUEUE_KEY: 'raahi_offline_queue',
};

/**
 * Helper: make authenticated API calls.
 */
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const res = await fetch(`${CONFIG.API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (res.status === 401 || res.status === 403) {
        // Token expired or invalid – redirect to login
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
        window.location.href = 'index.html';
        return;
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${res.status}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

/**
 * Show a toast notification.
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Determine a clean icon
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    else if (type === 'error') icon = '❌';
    else if (type === 'warning') icon = '⚠️';

    // Strip duplicate icons/emojis from the message to prevent redundant double icons (e.g. ✅ 🚨)
    let cleanMessage = message.trim();
    const leadingEmojis = ['🚨', '✅', '❌', '⚠️', '💚', 'ℹ️', '📍', '🛰️', '🔐', '🗑️', '🔒', '🔔'];
    for (const em of leadingEmojis) {
        if (cleanMessage.startsWith(em)) {
            cleanMessage = cleanMessage.slice(em.length).trim();
            break;
        }
    }
    for (const em of leadingEmojis) {
        if (cleanMessage.endsWith(em)) {
            cleanMessage = cleanMessage.slice(0, -em.length).trim();
            break;
        }
    }

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${cleanMessage}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px) scale(0.95)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Get the current user from localStorage.
 */
function getCurrentUser() {
    const data = localStorage.getItem(CONFIG.USER_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Check if user is authenticated.
 */
function isAuthenticated() {
    return !!localStorage.getItem(CONFIG.TOKEN_KEY);
}

/**
 * Format a timestamp to a readable string.
 */
function formatTime(isoString) {
    if (!isoString) return '—';
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ---- Global Theme Loader & Toggle Injector ----
(function initGlobalTheme() {
    const savedTheme = localStorage.getItem('raahi_theme');
    const isDark = savedTheme === 'dark';
    if (isDark) {
        document.body.classList.add('dark-theme');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sync theme class on body (in case it wasn't applied early)
    const savedTheme = localStorage.getItem('raahi_theme');
    const isDark = savedTheme === 'dark';
    if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // 2. Locate navbar actions container
    const navActions = document.getElementById('nav-auth-actions') || document.querySelector('.nav-actions');
    if (navActions && !document.getElementById('theme-toggle')) {
        // Create the theme toggle button
        const themeBtn = document.createElement('button');
        themeBtn.id = 'theme-toggle';
        themeBtn.className = 'icon-btn';
        themeBtn.setAttribute('aria-label', 'Toggle Theme');
        themeBtn.style.marginRight = '8px';
        themeBtn.onclick = toggleTheme;

        // SVG Icons
        themeBtn.innerHTML = `
            <svg id="theme-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: ${isDark ? 'block' : 'none'};"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <svg id="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: ${isDark ? 'none' : 'block'};"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        `;

        // Prepend theme button to navbar actions
        navActions.insertBefore(themeBtn, navActions.firstChild);
    }
});

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('raahi_theme', isDark ? 'dark' : 'light');
    
    // Sync all icons on the page
    document.querySelectorAll('#theme-icon-moon').forEach(el => {
        el.style.display = isDark ? 'none' : 'block';
    });
    document.querySelectorAll('#theme-icon-sun').forEach(el => {
        el.style.display = isDark ? 'block' : 'none';
    });
}
