/* ============================================================
   Raahi – Offline Handling
   Stores data in localStorage when offline, syncs on reconnect.
   ============================================================ */

const OfflineManager = {
    /**
     * Get the pending offline queue.
     */
    getQueue() {
        const raw = localStorage.getItem(CONFIG.OFFLINE_QUEUE_KEY);
        return raw ? JSON.parse(raw) : [];
    },

    /**
     * Save the queue back to localStorage.
     */
    saveQueue(queue) {
        localStorage.setItem(CONFIG.OFFLINE_QUEUE_KEY, JSON.stringify(queue));
        this.updatePendingUI();
    },

    /**
     * Add an item to the offline queue.
     * @param {string} type - 'location' | 'sos' | 'incident'
     * @param {object} data - The payload to send later
     */
    enqueue(type, data) {
        const queue = this.getQueue();
        queue.push({
            type,
            data,
            timestamp: new Date().toISOString(),
        });
        this.saveQueue(queue);
        console.log(`[Offline] Queued ${type} event. Queue size: ${queue.length}`);
    },

    /**
     * Flush the queue – attempt to sync all items to the server.
     */
    async flush() {
        const queue = this.getQueue();
        if (queue.length === 0) return;

        console.log(`[Offline] Syncing ${queue.length} queued items...`);
        showConnectionBar('syncing', `Syncing ${queue.length} queued items...`);

        const failed = [];

        for (const item of queue) {
            try {
                switch (item.type) {
                    case 'location':
                        await apiFetch('/locations', {
                            method: 'POST',
                            body: JSON.stringify(item.data),
                        });
                        break;
                    case 'sos':
                        await apiFetch('/alerts/sos', {
                            method: 'POST',
                            body: JSON.stringify(item.data),
                        });
                        break;
                    case 'incident':
                        await apiFetch('/incidents', {
                            method: 'POST',
                            body: JSON.stringify(item.data),
                        });
                        break;
                }
            } catch (err) {
                console.warn(`[Offline] Failed to sync ${item.type}:`, err);
                failed.push(item);
            }
        }

        this.saveQueue(failed);

        if (failed.length === 0) {
            showToast('All offline data synced successfully!', 'success');
            hideConnectionBar();
        } else {
            showToast(`${failed.length} items failed to sync. Will retry later.`, 'error');
        }
    },

    /**
     * Update the pending sync count in the UI.
     */
    updatePendingUI() {
        const el = document.getElementById('pending-sync');
        if (el) {
            el.textContent = this.getQueue().length;
        }
    },
};

/**
 * Show the connection bar (offline / syncing).
 */
function showConnectionBar(type, message) {
    const bar = document.getElementById('connection-bar');
    const text = document.getElementById('connection-text');
    if (!bar) return;
    bar.className = 'connection-bar ' + type;
    text.textContent = message;
}

/**
 * Hide the connection bar.
 */
function hideConnectionBar() {
    const bar = document.getElementById('connection-bar');
    if (bar) bar.className = 'connection-bar';
}

// Listen for online/offline events
window.addEventListener('online', () => {
    console.log('[Network] Back online');
    hideConnectionBar();
    showToast('You are back online', 'success');
    OfflineManager.flush();
});

window.addEventListener('offline', () => {
    console.log('[Network] Gone offline');
    showConnectionBar('offline', 'You are offline. Data will sync when reconnected.');
    showToast('You are offline. Data is being saved locally.', 'info');
});

// Check initial state
if (!navigator.onLine) {
    showConnectionBar('offline', 'You are offline. Data will sync when reconnected.');
}
