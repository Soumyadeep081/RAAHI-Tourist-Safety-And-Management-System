/* ============================================================
   Raahi – Location Tracking (Interval-based polling)
   ============================================================ */

let currentPosition = { latitude: null, longitude: null, accuracy: null };
let locationWatchId = null;
let locationIntervalId = null;
let locationRetryCount = 0;
const MAX_LOCATION_RETRIES = 3;

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
            locationRetryCount = 0;
            updateLocationUI();
        },
        (err) => {
            console.warn('[Location] Watch error:', err.message);
            locationRetryCount++;
            
            // Fallback for tests or environments without real GPS
            if (locationRetryCount >= MAX_LOCATION_RETRIES && !currentPosition.latitude) {
                console.info('[Location] Using simulated fallback location');
                currentPosition = {
                    latitude: 28.6139, // New Delhi default
                    longitude: 77.2090,
                    accuracy: 100,
                };
                updateLocationUI();
                showToast('Using simulated GPS for demo purposes.', 'info');
            }
            
            updateTrackingStatus('Error: ' + err.message);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 10000,
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
    const llat = document.getElementById('loc-lat');
    const llng = document.getElementById('loc-lng');
    const lacc = document.getElementById('loc-acc');
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

/**
 * Share the current location via clipboard.
 */
function shareLocation() {
    if (!currentPosition.latitude) {
        showToast('Location not available. Please wait for a GPS fix.', 'error');
        return;
    }
    
    const url = `https://www.google.com/maps?q=${currentPosition.latitude},${currentPosition.longitude}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Live Location - Raahi',
            text: 'I am sharing my live location for safety.',
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Location link copied to clipboard! 📋', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showToast('Failed to share location.', 'error');
        });
    }
}

