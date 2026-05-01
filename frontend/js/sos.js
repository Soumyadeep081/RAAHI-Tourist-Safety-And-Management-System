/* ============================================================
   Raahi – SOS Alert System
   ============================================================ */

/**
 * Quick SOS from the overview page (no message).
 */
async function triggerQuickSOS() {
    await triggerSOS();
}

/**
 * Trigger SOS using current GPS position.
 */
async function triggerSOS() {
    const btn = document.getElementById('sos-btn') || document.getElementById('quick-sos-btn');

    if (!currentPosition.latitude) {
        showToast('Waiting for GPS fix. Please try again.', 'error');
        return;
    }

    // Add pulse animation
    if (btn) btn.classList.add('active');

    const payload = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        message: '',
    };

    if (!navigator.onLine) {
        OfflineManager.enqueue('sos', payload);
        showToast('SOS queued. Will be sent when you are back online.', 'info');
        return;
    }

    try {
        await apiFetch('/alerts/sos', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        showToast('🚨 SOS alert sent! Help is on the way.', 'success');
        loadMyAlerts();
        loadDashboardStats();
    } catch (err) {
        showToast('🚨 SOS queued locally. Searching for network...', 'warning');
        OfflineManager.enqueue('sos', payload);
    }

    // Remove pulse after 5 seconds
    setTimeout(() => {
        if (btn) btn.classList.remove('active');
    }, 5000);
}

/**
 * Send SOS with a custom message from the form.
 */
async function sendSOSWithMessage(e) {
    e.preventDefault();

    if (!currentPosition.latitude) {
        showToast('Waiting for GPS fix. Please try again.', 'error');
        return;
    }

    const message = document.getElementById('sos-message').value.trim();

    const payload = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        message: message,
    };

    if (!navigator.onLine) {
        OfflineManager.enqueue('sos', payload);
        showToast('SOS queued. Will be sent when you are back online.', 'info');
        document.getElementById('sos-form').reset();
        return;
    }

    try {
        await apiFetch('/alerts/sos', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        showToast('🚨 SOS alert with details sent!', 'success');
        document.getElementById('sos-form').reset();

        // Pulse the button
        const btn = document.getElementById('sos-btn');
        if (btn) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 5000);
        }

        loadMyAlerts();
        loadDashboardStats();
    } catch (err) {
        showToast('🚨 SOS queued locally. Searching for network...', 'warning');
        OfflineManager.enqueue('sos', payload);
    }
}

/**
 * Load the user's own alerts.
 */
async function loadMyAlerts() {
    try {
        const data = await apiFetch('/alerts/my');
        const list = document.getElementById('my-alerts-list');
        if (!list) return;

        const activeCount = data.filter(a => a.status === 'ACTIVE').length;
        const statEl = document.getElementById('stat-alerts');
        if (statEl) statEl.textContent = activeCount;

        if (data.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔔</div><p>No alerts sent yet</p></div>';
            return;
        }

        list.innerHTML = data.map(alert => `
            <div class="list-item">
                <div class="list-item-info">
                    <h4>${alert.type === 'SOS' ? '🚨' : '⚠️'} ${alert.type} Alert</h4>
                    <p>${alert.message || 'No message'} • ${formatTime(alert.createdAt)}</p>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                    <span class="badge ${alert.status === 'ACTIVE' ? 'badge-active' : 'badge-resolved'}">${alert.status}</span>
                    ${alert.status === 'ACTIVE' ? `<button class="btn btn-outline btn-sm" onclick="resolveAlert(${alert.id})">Resolve</button>` : ''}
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('[Alerts] Load failed:', err);
    }
}

/**
 * Resolve an active alert.
 */
async function resolveAlert(alertId) {
    try {
        await apiFetch(`/alerts/${alertId}/resolve`, { method: 'PUT' });
        showToast('Alert resolved ✅', 'success');
        loadMyAlerts();
        loadDashboardStats();
    } catch (err) {
        showToast('Failed to resolve: ' + err.message, 'error');
    }
}

/**
 * Load nearby alerts.
 */
async function loadNearbyAlerts() {
    if (!currentPosition.latitude) return;

    try {
        const data = await apiFetch(
            `/alerts/nearby?lat=${currentPosition.latitude}&lng=${currentPosition.longitude}&radius=${CONFIG.NEARBY_RADIUS_KM}`
        );
        const list = document.getElementById('nearby-alerts-list');
        const countEl = document.getElementById('nearby-alert-count');
        if (countEl) countEl.textContent = data.length;

        if (!data || data.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">✅</div><p>No active alerts nearby. All clear!</p></div>';
            return;
        }

        list.innerHTML = data.map(a => `
            <div class="list-item">
                <div class="list-item-info">
                    <h4>${a.type === 'SOS' ? '🚨' : '⚠️'} ${a.type}</h4>
                    <p>${a.message || 'Emergency alert'} • ${a.distanceKm}km away • ${formatTime(a.createdAt)}</p>
                </div>
                <span class="badge badge-active">${a.status}</span>
            </div>
        `).join('');
    } catch (err) {
        console.error('[Alerts] Nearby load failed:', err);
    }
}

/**
 * Load nearby incidents.
 */
async function loadNearbyIncidents() {
    if (!currentPosition.latitude) return;

    try {
        const data = await apiFetch(
            `/incidents/nearby?lat=${currentPosition.latitude}&lng=${currentPosition.longitude}&radius=${CONFIG.NEARBY_RADIUS_KM}`
        );
        const list = document.getElementById('nearby-incidents-list');
        const countEl = document.getElementById('nearby-incident-count');
        if (countEl) countEl.textContent = data.length;

        const statEl = document.getElementById('stat-incidents');
        if (statEl) statEl.textContent = data.length;

        if (!data || data.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🗺️</div><p>No incidents reported near you</p></div>';
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
        console.error('[Incidents] Nearby load failed:', err);
    }
}
