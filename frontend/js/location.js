/* ============================================================
   Raahi – Location Tracking (Interval-based polling)
   ============================================================ */

let currentPosition = { latitude: null, longitude: null, accuracy: null };
let locationWatchId = null;
let locationIntervalId = null;
let locationRetryCount = 0;
const MAX_LOCATION_RETRIES = 3;
let isLocationPingEnabled = localStorage.getItem('raahi_location_pings') !== 'false';

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
    if (!isLocationPingEnabled) return;
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
    if (!currentPosition || !currentPosition.latitude) {
        showToast('Location not available. Please wait for a GPS fix.', 'error');
        return;
    }
    
    const url = `https://www.google.com/maps?q=${currentPosition.latitude},${currentPosition.longitude}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Live Location - Raahi',
            text: 'I am sharing my live location for safety.',
            url: url
        }).catch(err => {
            console.log('[Location] share failed or cancelled, falling back to clipboard copy:', err);
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Location link copied to clipboard! 📋', 'success');
        }).catch(err => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Location link copied to clipboard! 📋', 'success');
        } else {
            showToast('Failed to copy location link.', 'error');
        }
    } catch (err) {
        showToast('Failed to copy location link.', 'error');
    }
    document.body.removeChild(textArea);
}

/**
 * Toggle location pinging to the server ON/OFF.
 */
function toggleLocationPings(enabled) {
    isLocationPingEnabled = enabled;
    localStorage.setItem('raahi_location_pings', enabled ? 'true' : 'false');

    // Update Live Tracking diagnostic switch and status text
    const statusText = document.getElementById('ping-status-text');
    if (statusText) {
        statusText.textContent = enabled ? 'Enabled' : 'Paused';
        statusText.style.color = enabled ? '#22c55e' : '#ef4444';
    }

    const pingToggle = document.getElementById('ping-toggle');
    if (pingToggle) {
        pingToggle.checked = enabled;
    }

    // Update Settings Modal toggle checkbox
    const settingPings = document.getElementById('setting-location-pings');
    if (settingPings) {
        settingPings.checked = enabled;
    }

    // Update Overview Page card toggle and status
    const overviewToggle = document.getElementById('overview-ping-toggle');
    if (overviewToggle) {
        overviewToggle.checked = enabled;
    }

    const overviewText = document.getElementById('overview-ping-text');
    const overviewStatus = document.getElementById('overview-ping-status');
    const overviewDot = document.getElementById('overview-ping-dot');
    if (overviewText && overviewStatus && overviewDot) {
        overviewText.textContent = enabled ? 'Syncing' : 'Paused';
        overviewStatus.style.color = enabled ? '#10B981' : '#ef4444';
        overviewDot.style.background = enabled ? '#10B981' : '#ef4444';
        if (enabled) {
            overviewDot.style.animation = 'dot-pulse 1.5s infinite';
            overviewDot.style.boxShadow = '0 0 0 0 rgba(16, 185, 129, 0.7)';
        } else {
            overviewDot.style.animation = 'none';
            overviewDot.style.boxShadow = 'none';
        }
    }

    showToast(enabled ? 'Automatic location pings enabled! 🛰️' : 'Automatic location pings paused! 🔐', 'info');
}

