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
        if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
        if (overviewNameEl) overviewNameEl.textContent = user.name.split(' ')[0];
    }

    // Start location tracking
    startLocationTracking();

    // Load dashboard data
    loadDashboardStats();

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
        // Load alerts count
        const alerts = await apiFetch('/alerts/my');
        const activeAlerts = alerts.filter(a => a.status === 'ACTIVE').length;
        const statAlerts = document.getElementById('stat-alerts');
        if (statAlerts) statAlerts.textContent = activeAlerts;

        // Load contacts count
        const contacts = await apiFetch('/contacts');
        const statContacts = document.getElementById('stat-contacts');
        if (statContacts) statContacts.textContent = contacts.length;

        // Load location count
        const locations = await apiFetch('/locations');
        const statLocations = document.getElementById('stat-locations');
        if (statLocations) statLocations.textContent = locations.length;

        // Load nearby incidents count
        if (currentPosition.latitude) {
            const incidents = await apiFetch(
                `/incidents/nearby?lat=${currentPosition.latitude}&lng=${currentPosition.longitude}&radius=${CONFIG.NEARBY_RADIUS_KM}`
            );
            const statIncidents = document.getElementById('stat-incidents');
            if (statIncidents) statIncidents.textContent = incidents.length;
        }
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

    try {
        await apiFetch('/contacts', {
            method: 'POST',
            body: JSON.stringify({
                name: document.getElementById('contact-name').value.trim(),
                phone: document.getElementById('contact-phone').value.trim(),
                email: document.getElementById('contact-email').value.trim() || null,
                relation: document.getElementById('contact-relation').value.trim() || null,
            }),
        });

        showToast('Emergency contact added ✅', 'success');
        document.getElementById('contact-form').reset();
        loadContacts();
        loadDashboardStats();
    } catch (err) {
        showToast('Failed to add contact: ' + err.message, 'error');
    }
}

async function deleteContact(id) {
    if (!confirm('Remove this emergency contact?')) return;

    try {
        await apiFetch(`/contacts/${id}`, { method: 'DELETE' });
        showToast('Contact removed', 'info');
        loadContacts();
        loadDashboardStats();
    } catch (err) {
        showToast('Failed to delete: ' + err.message, 'error');
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
        showToast('Incident reported. Thank you for helping. ⚠️', 'success');
        document.getElementById('incident-form').reset();
        loadMyIncidents();
    } catch (err) {
        showToast('Failed to report: ' + err.message, 'error');
        OfflineManager.enqueue('incident', payload);
    }
}

async function loadMyIncidents() {
    try {
        const data = await apiFetch('/incidents/my');
        const list = document.getElementById('my-incidents-list');
        if (!list) return;

        if (!data || data.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📝</div><p>You haven\'t reported any incidents</p></div>';
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
    }
}
