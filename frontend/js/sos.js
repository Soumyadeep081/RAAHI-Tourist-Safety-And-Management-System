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
                    <a href="alert-tracking.html?id=${alert.id}" class="btn btn-outline btn-sm" style="display: flex; align-items: center; gap: 6px; text-decoration: none;">
                        📦 Track
                    </a>
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

/**
 * Toggle the slide-down Amazon/Flipkart tracking stepper panel.
 */
function toggleAlertTracking(alertId) {
    const el = document.getElementById(`stepper-${alertId}`);
    const btn = document.getElementById(`track-btn-${alertId}`);
    if (!el || !btn) return;

    if (el.style.display === 'block') {
        el.style.display = 'none';
        btn.innerHTML = '📦 Track';
    } else {
        el.style.display = 'block';
        btn.innerHTML = '❌ Close';
    }
}

/**
 * Generate Flipkart/Amazon-style progress tracking stepper HTML.
 */
function getAlertProgress(alert) {
    const createdTime = new Date(alert.createdAt).getTime();
    const now = new Date().getTime();
    const elapsedSeconds = (now - createdTime) / 1000;

    let currentStepIndex = 0; // 0: Triggered, 1: Notified, 2: Dispatched, 3: Arrived, 4: Resolved
    const isResolved = alert.status === 'RESOLVED';

    if (isResolved) {
        currentStepIndex = 4;
    } else {
        if (elapsedSeconds < 15) {
            currentStepIndex = 0;
        } else if (elapsedSeconds < 45) {
            currentStepIndex = 1;
        } else if (elapsedSeconds < 90) {
            currentStepIndex = 2;
        } else {
            currentStepIndex = 3;
        }
    }

    const steps = [
        { title: 'Alert Triggered 🚨', desc: 'Emergency signal successfully transmitted from your device.' },
        { title: 'Dispatch Center Notified 📞', desc: 'Raahi Emergency response team routing coordinates to local rescue stations.' },
        { title: 'Emergency Responders Dispatched 🚒', desc: 'Local police, fire, or medical units dispatched to your coordinates.' },
        { title: 'Responders Arrived on Scene 🚑', desc: 'Emergency personnel are arriving at your live tracking area.' },
        { title: 'Alert Resolved & Safe 💚', desc: 'The distress situation has been marked resolved. You are safe.' }
    ];

    let html = `<ul class="stepper">`;
    steps.forEach((step, idx) => {
        let statusClass = '';
        let stepTimeText = '';

        if (isResolved || idx < currentStepIndex) {
            statusClass = 'completed';
            let offsetMs = idx === 0 ? 0 : idx === 1 ? 15000 : idx === 2 ? 45000 : 90000;
            let stepTime = new Date(createdTime + offsetMs);
            if (idx === 4) {
                stepTime = alert.resolvedAt ? new Date(alert.resolvedAt) : new Date(createdTime + 120000);
            }
            stepTimeText = formatTime(stepTime.toISOString());
        } else if (idx === currentStepIndex) {
            statusClass = 'active';
            stepTimeText = 'In Progress...';
        } else {
            statusClass = 'pending';
            stepTimeText = '';
        }

        const iconContent = (isResolved || idx < currentStepIndex) ? '✓' : idx + 1;

        html += `
            <li class="stepper-step ${statusClass}">
                <span class="stepper-icon">${iconContent}</span>
                <div class="stepper-content">
                    <div class="stepper-title">${step.title}</div>
                    <div class="stepper-desc">${step.desc}</div>
                    ${stepTimeText ? `<div class="stepper-time">${stepTimeText}</div>` : ''}
                </div>
            </li>
        `;
    });
    html += `</ul>`;
    return html;
}
