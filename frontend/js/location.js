/* ============================================================
   Raahi – Location Tracking (Interval-based polling)
   ============================================================ */

let currentPosition = { latitude: null, longitude: null, accuracy: null };
let locationWatchId = null;
let locationIntervalId = null;

/**
 * Start tracking the user's location.
 * Uses navigator.geolocation.watchPosition for real-time updates
 * and setInterval for periodic server pushes.
 */
function startLocationTracking() {
    if (!('geolocation' in navigator)) {
        showToast('Geolocation not supported by your browser', 'error');
        updateTrackingStatus('Unsupported');
        return;
    }

    // Watch position for real-time UI updates
    locationWatchId = navigator.geolocation.watchPosition(
        (pos) => {
            currentPosition = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
            };
            updateLocationUI();
        },
        (err) => {
            console.warn('[Location] Watch error:', err.message);
            updateTrackingStatus('Error');
        },
        {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 15000,
        }
    );

    // Send location to server every LOCATION_INTERVAL_MS
    locationIntervalId = setInterval(() => {
        sendLocationToServer();
    }, CONFIG.LOCATION_INTERVAL_MS);

    updateTrackingStatus('Active');
    console.log('[Location] Tracking started');
}

/**
 * Stop tracking.
 */
function stopLocationTracking() {
    if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
        locationWatchId = null;
    }
    if (locationIntervalId !== null) {
        clearInterval(locationIntervalId);
        locationIntervalId = null;
    }
    updateTrackingStatus('Stopped');
}

/**
 * Send the current position to the backend.
 * Falls back to offline queue if the network is down.
 */
async function sendLocationToServer() {
    if (!currentPosition.latitude) return;

    const payload = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        accuracy: currentPosition.accuracy,
    };

    if (!navigator.onLine) {
        OfflineManager.enqueue('location', payload);
        return;
    }

    try {
        await apiFetch('/locations', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.warn('[Location] Push failed, queuing offline:', err);
        OfflineManager.enqueue('location', payload);
    }
}

/**
 * Update the location display in the UI.
 */
function updateLocationUI() {
    const { latitude, longitude, accuracy } = currentPosition;
    if (!latitude) return;

    // Overview section
    const olat = document.getElementById('overview-lat');
    const olng = document.getElementById('overview-lng');
    if (olat) olat.textContent = latitude.toFixed(6);
    if (olng) olng.textContent = longitude.toFixed(6);

    // Location section
    const llat = document.getElementById('live-lat');
    const llng = document.getElementById('live-lng');
    const lacc = document.getElementById('live-accuracy');
    if (llat) llat.textContent = latitude.toFixed(6);
    if (llng) llng.textContent = longitude.toFixed(6);
    if (lacc) lacc.textContent = accuracy ? accuracy.toFixed(1) : '—';
}

function updateTrackingStatus(status) {
    const el = document.getElementById('tracking-status');
    if (el) el.textContent = status;
}

/**
 * Load location history from the server.
 */
async function loadLocationHistory() {
    try {
        const data = await apiFetch('/locations');
        const list = document.getElementById('location-history-list');
        if (!list) return;

        if (!data || data.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🗺️</div><p>No location history yet</p></div>';
            return;
        }

        // Update overview stat
        const statEl = document.getElementById('stat-locations');
        if (statEl) statEl.textContent = data.length;

        list.innerHTML = data.slice(0, 20).map(loc => `
            <div class="list-item">
                <div class="list-item-info">
                    <h4>📍 ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}</h4>
                    <p>Accuracy: ${loc.accuracy ? loc.accuracy.toFixed(1) + 'm' : '—'} • ${formatTime(loc.timestamp)}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('[Location] History load failed:', err);
    }
}
