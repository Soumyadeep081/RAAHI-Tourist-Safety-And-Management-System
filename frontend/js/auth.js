/* ============================================================
   Raahi – Authentication (Login / Register)
   ============================================================ */

// Redirect if already logged in
(function checkAuth() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
})();

/**
 * Switch between Login and Register tabs.
 */
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

/**
 * Handle login form submission.
 */
async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Signing in...';

    try {
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: document.getElementById('login-email').value.trim(),
                password: document.getElementById('login-password').value,
            }),
        });

        localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
        }));

        window.location.href = 'dashboard.html';
    } catch (err) {
        alert(err.message || 'Login failed. Please check your credentials.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
    }
}

/**
 * Handle register form submission.
 */
async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('register-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Creating...';

    try {
        const data = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: document.getElementById('reg-name').value.trim(),
                email: document.getElementById('reg-email').value.trim(),
                password: document.getElementById('reg-password').value,
                phone: document.getElementById('reg-phone').value.trim(),
            }),
        });

        localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
        }));

        window.location.href = 'dashboard.html';
    } catch (err) {
        alert(err.message || 'Registration failed. Please try again.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});
