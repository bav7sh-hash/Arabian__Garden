/* ========================================
   KITCHEN DASHBOARD - MAIN SCRIPT
   ======================================== */

// State
let orders = [];
let currentStatusFilter = 'all';
let currentTableFilter = null;
let unsubscribe = null;

// DOM Elements
const ordersGrid = document.getElementById('ordersGrid');
const noOrders = document.getElementById('noOrders');
const pendingCount = document.getElementById('pendingCount');
const preparingCount = document.getElementById('preparingCount');
const readyCount = document.getElementById('readyCount');
const allCount = document.getElementById('allCount');
const kitchenTime = document.getElementById('kitchenTime');

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Parse URL parameters
    parseUrlParams();
    
    // Setup real-time listener from Firebase
    setupFirebaseRealtimeListener();
    
    // Setup event listeners
    setupEventListeners();
    
    // Start clock
    startClock();
});

function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    let foundTable = params.get('table');
    
    if (!foundTable) {
        // Search for 'table' followed by any number of digits in the whole query string
        const match = window.location.search.match(/table(\d+)/i);
        if (match) {
            foundTable = match[1];
        }
    }
    
    if (foundTable) {
        const tableNum = parseInt(foundTable);
        if (!isNaN(tableNum)) {
            currentTableFilter = tableNum;
            
            // Update navigation links to preserve table number
            document.querySelectorAll('.nav-link').forEach(link => {
                let href = link.getAttribute('href');
                if (href && href !== '/' && href !== '#') {
                    // Append or update table parameter
                    if (href.includes('?')) {
                        if (href.includes('table=')) {
                            href = href.replace(/table=\d+/, `table=${currentTableFilter}`);
                        } else {
                            href += `&table=${currentTableFilter}`;
                        }
                    } else {
                        href += `?table=${currentTableFilter}`;
                    }
                    link.setAttribute('href', href);
                }
            });
        }
    }
}

// ========================================
// DATA LOADING (FIREBASE)
// ========================================

function setupFirebaseRealtimeListener() {
    // Clean up previous listener if it exists
    if (unsubscribe) {
        unsubscribe();
    }
    
    // Use window.FirebaseService to listen to orders in realtime
    unsubscribe = window.FirebaseService.listenToOrders((newOrders) => {
        orders = newOrders;
        
        // Filter by table if parameter is present
        if (currentTableFilter) {
            orders = orders.filter(o => o.tableNumber === currentTableFilter);
        }
        
        // Filter by status tab
        let filteredOrders = orders;
        if (currentStatusFilter !== 'all') {
            filteredOrders = orders.filter(o => o.status === currentStatusFilter);
        }
        
        renderOrders(filteredOrders);
        updateStats();
    });
}

// ========================================
// RENDERING
// ========================================

function renderOrders(filteredOrders) {
    if (!filteredOrders || filteredOrders.length === 0) {
        ordersGrid.innerHTML = '';
        noOrders.classList.add('active');
        return;
    }
    
    noOrders.classList.remove('active');
    
    ordersGrid.innerHTML = filteredOrders.map(order => {
        // Handle Firestore timestamp
        const orderTime = order.timestamp ? order.timestamp.toDate() : new Date();
        const timeAgo = getTimeAgo(orderTime);
        
        return `
            <div class="order-card ${order.status}" data-id="${order.id}">
                <div class="order-card-header">
                    <div class="order-table">
                        <span class="order-table-number">${order.tableNumber}</span>
                        <span class="order-table-label">Table</span>
                    </div>
                    <div class="order-time">
                        <span class="order-time-value">${orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span class="order-time-ago">${timeAgo}</span>
                    </div>
                </div>
                <div class="order-card-items">
                    <div class="order-item">
                        <span class="order-item-name">${order.itemName}</span>
                        <span class="order-item-qty">x${order.quantity}</span>
                    </div>
                </div>
                <div class="order-card-actions">
                    ${getActionButtons(order)}
                </div>
            </div>
        `;
    }).join('');
}

function getActionButtons(order) {
    switch (order.status) {
        case 'pending':
            return `
                <button class="order-action-btn btn-preparing" onclick="updateStatus('${order.id}', 'prepared')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Mark as Prepared
                </button>
            `;
        default:
            return '';
    }
}

function updateStats() {
    const pending = orders.filter(o => o.status === 'pending').length;
    const prepared = orders.filter(o => o.status === 'prepared').length;
    
    pendingCount.textContent = pending;
    preparingCount.textContent = prepared; // Using preparing slot for prepared
    allCount.textContent = orders.length;
    
    // Update tab counts
    if (document.getElementById('pendingTabCount')) document.getElementById('pendingTabCount').textContent = pending;
    if (document.getElementById('preparingTabCount')) document.getElementById('preparingTabCount').textContent = prepared;
    
    // Update pending count with animation if increased
    if (pending > 0) {
        pendingCount.style.animation = 'none';
        pendingCount.offsetHeight; // Trigger reflow
        pendingCount.style.animation = 'pulse 1s ease';
    }
}

// ========================================
// ORDER ACTIONS (FIREBASE)
// ========================================

async function updateStatus(orderId, newStatus) {
    const card = document.querySelector(`.order-card[data-id="${orderId}"]`);
    if (card) {
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
    }
    
    try {
        if (newStatus === 'prepared') {
            await window.FirebaseService.markAsPrepared(orderId);
        }
    } catch (error) {
        console.error('Failed to update order status:', error);
        if (card) {
            card.style.opacity = '1';
            card.style.pointerEvents = '';
        }
        alert('Failed to update status. Please try again.');
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Tab filters
    document.querySelectorAll('.kitchen-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.kitchen-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentStatusFilter = tab.dataset.status;
            
            // Re-filter orders based on new status
            let filtered = orders;
            if (currentStatusFilter !== 'all') {
                filtered = orders.filter(o => o.status === currentStatusFilter);
            }
            renderOrders(filtered);
        });
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function startClock() {
    function updateClock() {
        const now = new Date();
        kitchenTime.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
}

function playNotificationSound() {
    try {
        const audio = document.getElementById('notificationSound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
        
        // Visual notification
        document.body.style.animation = 'flash 0.5s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    } catch (e) {
        // Ignore audio errors
    }
}

// Add flash animation
const style = document.createElement('style');
style.textContent = `
    @keyframes flash {
        0%, 100% { background-color: #0d0d0d; }
        50% { background-color: #1a2a1a; }
    }
`;
document.head.appendChild(style);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (unsubscribe) {
        unsubscribe();
    }
});
