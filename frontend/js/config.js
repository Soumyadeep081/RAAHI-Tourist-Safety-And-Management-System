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
    toast.innerHTML = `
        <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
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
