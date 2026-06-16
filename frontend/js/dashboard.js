/* ============================================================
   Raahi – Dashboard Controller
   Handles navigation, contacts, incidents, and initialization.
   ============================================================ */

// ---- Auth guard ----
(function guard() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
    }
})();

// ---- Initialize Dashboard ----
document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (user) {
        // Populate user info
        const nameEl = document.getElementById('user-name');
        const avatarEl = document.getElementById('user-avatar');
        const overviewNameEl = document.getElementById('overview-name');

        if (nameEl) nameEl.textContent = user.name;
        if (avatarEl) avatarEl.textContent = user.name;
        if (overviewNameEl) overviewNameEl.textContent = user.name.split(' ')[0];
    }

    // Start location tracking
    startLocationTracking();

    // Load dashboard data
    loadDashboardStats();
    loadContacts();
    loadMyIncidents();
    loadMyAlerts();
    if (typeof loadLocationHistory === 'function') loadLocationHistory();

    // Sync any offline data
    if (navigator.onLine) {
        OfflineManager.flush();
    }
    OfflineManager.updatePendingUI();
});

// ---- Section Navigation ----
function showSection(sectionId, btnEl) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

    // Show target section
    const target = document.getElementById('section-' + sectionId);
    if (target) {
        target.classList.add('active');
        target.classList.add('fade-in');
    }

    // Update sidebar active item
    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    // Load data for the section
    switch (sectionId) {
        case 'overview':
            loadDashboardStats();
            break;
        case 'sos':
            loadMyAlerts();
            break;
        case 'location':
            loadLocationHistory();
            OfflineManager.updatePendingUI();
            break;
        case 'contacts':
            loadContacts();
            break;
        case 'incidents':
            loadMyIncidents();
            break;
        case 'alerts':
            loadNearbyAlerts();
            loadNearbyIncidents();
            break;
    }

    // Close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

// ---- Toggle Sidebar (Mobile) ----
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

// ---- Logout ----
function logout() {
    stopLocationTracking();
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    window.location.href = 'index.html';
}

// ---- Dashboard Stats ----
async function loadDashboardStats() {
    try {
        const stats = await apiFetch('/stats/dashboard');
        
        const updateStat = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value || '0';
        };

        updateStat('stat-alerts', stats.activeAlerts);
        updateStat('stat-contacts', stats.contactsCount);
        updateStat('stat-locations', stats.locationsCount);
        updateStat('stat-incidents', stats.nearbyIncidents);
    } catch (err) {
        console.error('[Dashboard] Stats load failed:', err);
    }
}

// ---- Emergency Contacts ----
async function loadContacts() {
    try {
        const data = await apiFetch('/contacts');
        const list = document.getElementById('contacts-list');
        if (!list) return;

        if (!data || data.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👥</div><p>No emergency contacts added yet</p></div>';
            return;
        }

        list.innerHTML = data.map(c => `
            <div class="list-item">
                <div class="list-item-info">
                    <h4>👤 ${c.name}</h4>
                    <p>${c.phone}${c.email ? ' • ' + c.email : ''}${c.relation ? ' • ' + c.relation : ''}</p>
                </div>
                <button class="btn-icon-danger" onclick="deleteContact(${c.id})" title="Remove contact">🗑️</button>
            </div>
        `).join('');
    } catch (err) {
        console.error('[Contacts] Load failed:', err);
    }
}

async function addContact(e) {
    e.preventDefault();

    const nameEl = document.getElementById('contact-name');
    const phoneEl = document.getElementById('contact-phone');
    const emailEl = document.getElementById('contact-email');
    const relationEl = document.getElementById('contact-relation');

    try {
        await apiFetch('/contacts', {
            method: 'POST',
            body: JSON.stringify({
                name: nameEl.value.trim(),
                phone: phoneEl.value.trim(),
                email: emailEl ? emailEl.value.trim() : null,
                relation: relationEl ? relationEl.value.trim() : null,
            }),
        });
        document.getElementById('contact-form').reset();
        loadContacts();
        loadDashboardStats();
    } catch (err) {
        showToast('Failed to add contact: ' + err.message, 'error');
    }
}

async function deleteContact(id) {
    if (!confirm('Remove this emergency contact?')) return;

    // Prevent double-clicking
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '...';
    btn.disabled = true;

    try {
        await apiFetch(`/contacts/${id}`, { method: 'DELETE' });
        loadContacts();
        loadDashboardStats();
    } catch (err) {
        showToast('Failed to delete: ' + err.message, 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// ---- Incidents ----
async function reportIncident(e) {
    e.preventDefault();

    if (!currentPosition.latitude) {
        showToast('Waiting for GPS fix. Please try again.', 'error');
        return;
    }

    const payload = {
        type: document.getElementById('incident-type').value,
        description: document.getElementById('incident-desc').value.trim(),
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
    };

    if (!navigator.onLine) {
        OfflineManager.enqueue('incident', payload);
        showToast('Incident queued. Will be submitted when online.', 'info');
        document.getElementById('incident-form').reset();
        return;
    }

    try {
        await apiFetch('/incidents', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        document.getElementById('incident-form').reset();
        loadMyIncidents();
    } catch (err) {
        showToast('Failed to report: ' + err.message, 'error');
        OfflineManager.enqueue('incident', payload);
    }
}

async function loadMyIncidents() {
    const list = document.getElementById('my-incidents-list');
    if (!list) return;
    
    // Show loading state if it's currently empty or has old data
    if (list.innerHTML === '' || list.innerHTML.includes('No recent')) {
        list.innerHTML = '<div style="padding: 32px; text-align: center;"><span class="pulse-dot"></span> Loading reports...</div>';
    }

    try {
        const data = await apiFetch('/incidents/my');
        
        if (!data || data.length === 0) {
            list.innerHTML = '<div class="empty-state" style="padding: 32px;"><div class="empty-state-icon">📝</div><p>You haven\'t reported any incidents</p></div>';
            return;
        }

        list.innerHTML = data.map(i => `
            <div class="list-item">
                <div class="list-item-info">
                    <h4>⚠️ ${i.type.replace('_', ' ')}</h4>
                    <p>${i.description.substring(0, 80)}${i.description.length > 80 ? '...' : ''} • ${formatTime(i.createdAt)}</p>
                </div>
                <span class="badge badge-warning">${i.status}</span>
            </div>
        `).join('');
    } catch (err) {
        console.error('[Incidents] My incidents load failed:', err);
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--color-primary);">Error loading reports.</div>';
    }
}
