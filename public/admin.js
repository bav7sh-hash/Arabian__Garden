/* ========================================
   ADMIN PANEL - MAIN SCRIPT
   ======================================== */

// State
let isLoggedIn = false;
let menuItems = [];
let offers = [];
let orders = [];
let currentSection = 'overview';
let currentTableFilter = null;

// DOM Elements
const adminLogin = document.getElementById('adminLogin');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

let ordersUnsubscribe = null;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Parse URL parameters
    parseUrlParams();
    
    // Check if already logged in
    if (localStorage.getItem('admin_logged_in') === 'true') {
        showDashboard();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Set current date
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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
            document.querySelectorAll('.nav-item-link').forEach(link => {
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
// AUTHENTICATION
// ========================================

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Demo credentials
    if (email === 'admin@savoria.com' && password === 'admin123') {
        localStorage.setItem('admin_logged_in', 'true');
        showDashboard();
    } else {
        alert('Invalid credentials. Use admin@savoria.com / admin123');
    }
}

function handleLogout() {
    localStorage.removeItem('admin_logged_in');
    adminDashboard.classList.remove('active');
    adminLogin.classList.remove('hidden');
    isLoggedIn = false;
}

async function showDashboard() {
    isLoggedIn = true;
    adminLogin.style.display = 'none';
    adminDashboard.classList.add('active');
    
    // Setup Firebase listener for realtime stats and orders
    setupFirebaseAdminListener();
    
    // Load static data from Supabase
    await loadMenuItems();
    await loadOffers();
}

// ========================================
// DATA LOADING
// ========================================

function setupFirebaseAdminListener() {
    if (ordersUnsubscribe) ordersUnsubscribe();
    
    ordersUnsubscribe = window.FirebaseService.listenToOrders((newOrders) => {
        orders = newOrders;
        
        // Filter by table if parameter is present
        if (currentTableFilter) {
            orders = orders.filter(o => o.tableNumber === currentTableFilter);
        }
        
        updateOverviewStats();
        
        if (currentSection === 'orders') {
            renderAllOrdersTable();
        }
    });
}

function updateOverviewStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter(o => {
        const orderDate = o.timestamp ? o.timestamp.toDate() : new Date();
        return orderDate >= today;
    });
    
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.price * o.quantity), 0);
    
    document.getElementById('todayOrders').textContent = todayOrders.length;
    document.getElementById('todayRevenue').textContent = `₹${todayRevenue.toFixed(2)}`;
    document.getElementById('totalItems').textContent = menuItems.length;
    document.getElementById('pendingOrders').textContent = pendingOrders.length;
    
    // Render recent orders table
    renderRecentOrdersTable(orders.slice(0, 10));
}

async function loadMenuItems() {
    menuItems = await window.SupabaseDB.fetchAllMenu();
    renderAdminMenuGrid();
    updateOverviewStats(); // Update total items count
}

async function loadOffers() {
    offers = await window.SupabaseDB.fetchOffers();
    renderAdminOffersGrid();
}

// loadOrders is now reactive through setupFirebaseAdminListener
async function loadOrders() {
    // No-op, handled by listener
}

// ========================================
// RENDERING
// ========================================

function renderRecentOrdersTable(recentOrders) {
    const tbody = document.getElementById('recentOrdersTable');
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--foreground-muted);">
                    No orders yet
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = recentOrders.map(order => {
        const orderTime = order.timestamp ? order.timestamp.toDate() : new Date();
        return `
            <tr>
                <td>#${order.id.substring(0, 6)}</td>
                <td>Table ${order.tableNumber}</td>
                <td>${order.itemName} (x${order.quantity})</td>
                <td>₹${(order.price * order.quantity).toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>${orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
        `;
    }).join('');
}

function renderAdminMenuGrid() {
    const grid = document.getElementById('adminMenuGrid');
    const categoryFilter = document.getElementById('menuCategoryFilter').value;
    const searchQuery = document.getElementById('menuSearchInput').value.toLowerCase();
    
    let filteredItems = [...menuItems];
    
    if (categoryFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === categoryFilter);
    }
    
    if (searchQuery) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchQuery)
        );
    }
    
    grid.innerHTML = filteredItems.map(item => `
        <div class="admin-menu-card" data-id="${item.id}">
            <div class="admin-menu-card-image">
                <img src="${item.image || 'https://via.placeholder.com/400x300'}" alt="${item.name}">
                ${!item.available ? '<div class="unavailable-overlay">Unavailable</div>' : ''}
            </div>
            <div class="admin-menu-card-content">
                <div class="admin-menu-card-header">
                    <span class="admin-menu-card-name">${item.name}</span>
                    <span class="admin-menu-card-price">₹${item.price.toFixed(2)}</span>
                </div>
                <div class="admin-menu-card-meta">
                    <span>${item.category}</span>
                    ${item.veg ? '<span style="color: var(--veg)">Veg</span>' : ''}
                    ${item.spicy ? '<span style="color: var(--spicy)">Spicy</span>' : ''}
                </div>
                <div class="admin-menu-card-actions">
                    <button class="edit-btn" onclick="editMenuItem(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                    </button>
                    <button class="delete-btn" onclick="deleteMenuItem(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAdminOffersGrid() {
    const grid = document.getElementById('adminOffersGrid');
    
    grid.innerHTML = offers.map(offer => `
        <div class="admin-offer-card" data-id="${offer.id}">
            <div class="admin-offer-card-image">
                ${offer.image ? `<img src="${offer.image}" alt="Offer">` : `<span style="color: var(--background); font-weight: 600;">${offer.text}</span>`}
            </div>
            <div class="admin-offer-card-content">
                <p class="admin-offer-card-text">${offer.text}</p>
                <div class="admin-menu-card-actions">
                    <button class="edit-btn" onclick="editOffer(${offer.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                    </button>
                    <button class="delete-btn" onclick="deleteOffer(${offer.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAllOrdersTable() {
    const tbody = document.getElementById('allOrdersTable');
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--foreground-muted);">
                    No orders found
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => {
        const orderTime = order.timestamp ? order.timestamp.toDate() : new Date();
        return `
            <tr>
                <td>#${order.id.substring(0, 6)}</td>
                <td>Table ${order.tableNumber}</td>
                <td>${order.itemName} (x${order.quantity})</td>
                <td>₹${(order.price * order.quantity).toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>${orderTime.toLocaleDateString()} ${orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
        `;
    }).join('');
}

// ========================================
// MENU ITEM MANAGEMENT
// ========================================

const menuItemModal = document.getElementById('menuItemModal');
const menuItemForm = document.getElementById('menuItemForm');
const menuModalTitle = document.getElementById('menuModalTitle');

function openMenuItemModal(item = null) {
    menuItemModal.classList.add('active');
    
    if (item) {
        menuModalTitle.textContent = 'Edit Menu Item';
        document.getElementById('menuItemId').value = item.id;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemImage').value = item.image || '';
        document.getElementById('itemVeg').checked = item.veg;
        document.getElementById('itemSpicy').checked = item.spicy;
        document.getElementById('itemAvailable').checked = item.available;
    } else {
        menuModalTitle.textContent = 'Add Menu Item';
        menuItemForm.reset();
        document.getElementById('menuItemId').value = '';
        document.getElementById('itemAvailable').checked = true;
    }
}

function closeMenuItemModal() {
    menuItemModal.classList.remove('active');
}

async function handleMenuItemSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('menuItemId').value;
    const itemData = {
        restaurant_id: 1,
        name: document.getElementById('itemName').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        category: document.getElementById('itemCategory').value,
        image: document.getElementById('itemImage').value || 'https://via.placeholder.com/400x300',
        veg: document.getElementById('itemVeg').checked,
        spicy: document.getElementById('itemSpicy').checked,
        available: document.getElementById('itemAvailable').checked
    };
    
    try {
        if (id) {
            await window.SupabaseDB.updateMenuItem(parseInt(id), itemData);
        } else {
            await window.SupabaseDB.addMenuItem(itemData);
        }
        
        closeMenuItemModal();
        await loadMenuItems();
        await loadOverviewStats();
    } catch (error) {
        console.error('Failed to save menu item:', error);
        alert('Failed to save menu item');
    }
}

function editMenuItem(id) {
    const item = menuItems.find(i => i.id === id);
    if (item) {
        openMenuItemModal(item);
    }
}

async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
        await window.SupabaseDB.deleteMenuItem(id);
        await loadMenuItems();
        await loadOverviewStats();
    } catch (error) {
        console.error('Failed to delete menu item:', error);
        alert('Failed to delete menu item');
    }
}

// ========================================
// OFFER MANAGEMENT
// ========================================

const offerModal = document.getElementById('offerModal');
const offerForm = document.getElementById('offerForm');
const offerModalTitle = document.getElementById('offerModalTitle');

function openOfferModal(offer = null) {
    offerModal.classList.add('active');
    
    if (offer) {
        offerModalTitle.textContent = 'Edit Offer';
        document.getElementById('offerId').value = offer.id;
        document.getElementById('offerText').value = offer.text;
        document.getElementById('offerImage').value = offer.image || '';
    } else {
        offerModalTitle.textContent = 'Add Offer';
        offerForm.reset();
        document.getElementById('offerId').value = '';
    }
}

function closeOfferModal() {
    offerModal.classList.remove('active');
}

async function handleOfferSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('offerId').value;
    const offerData = {
        restaurant_id: 1,
        text: document.getElementById('offerText').value,
        image: document.getElementById('offerImage').value || null
    };
    
    try {
        if (id) {
            await window.SupabaseDB.updateOffer(parseInt(id), offerData);
        } else {
            await window.SupabaseDB.addOffer(offerData);
        }
        
        closeOfferModal();
        await loadOffers();
    } catch (error) {
        console.error('Failed to save offer:', error);
        alert('Failed to save offer');
    }
}

function editOffer(id) {
    const offer = offers.find(o => o.id === id);
    if (offer) {
        openOfferModal(offer);
    }
}

async function deleteOffer(id) {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    try {
        await window.SupabaseDB.deleteOffer(id);
        await loadOffers();
    } catch (error) {
        console.error('Failed to delete offer:', error);
        alert('Failed to delete offer');
    }
}

// ========================================
// ORDER MANAGEMENT
// ========================================

async function deleteOrderAdmin(id) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
        await window.SupabaseDB.deleteOrder(id);
        await loadOrders();
        await loadOverviewStats();
    } catch (error) {
        console.error('Failed to delete order:', error);
        alert('Failed to delete order');
    }
}

// ========================================
// REPORTS
// ========================================

async function exportDailyReport() {
    try {
        const csv = await window.SupabaseDB.exportDailySales();
        downloadCSV(csv, `daily-sales-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
        console.error('Failed to export daily report:', error);
        alert('Failed to export report');
    }
}

async function exportWeeklyReport() {
    try {
        // Get orders from the past week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const orders = await window.SupabaseDB.fetchOrders({ date: weekAgo.toISOString() });
        
        const headers = ['Order ID', 'Table', 'Items', 'Total', 'Status', 'Date'];
        const rows = orders.map(o => [
            o.id,
            o.table_number,
            o.items.map(i => `${i.name} x${i.quantity}`).join('; '),
            `₹${o.total_price.toFixed(2)}`,
            o.status,
            new Date(o.created_at).toLocaleString()
        ]);
        
        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        downloadCSV(csv, `weekly-sales-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
        console.error('Failed to export weekly report:', error);
        alert('Failed to export report');
    }
}

async function exportMonthlyReport() {
    try {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        const orders = await window.SupabaseDB.fetchOrders({ date: monthAgo.toISOString() });
        
        const headers = ['Order ID', 'Table', 'Items', 'Total', 'Status', 'Date'];
        const rows = orders.map(o => [
            o.id,
            o.table_number,
            o.items.map(i => `${i.name} x${i.quantity}`).join('; '),
            `₹${o.total_price.toFixed(2)}`,
            o.status,
            new Date(o.created_at).toLocaleString()
        ]);
        
        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        downloadCSV(csv, `monthly-sales-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
        console.error('Failed to export monthly report:', error);
        alert('Failed to export report');
    }
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

// ========================================
// AUTOMATION
// ========================================

async function runAutoDelete() {
    try {
        const deleted = await window.SupabaseDB.deleteOldOrders();
        if (deleted > 0) {
            console.log(`Auto-deleted ${deleted} old orders`);
            await loadOrders();
            await loadOverviewStats();
        }
    } catch (error) {
        console.error('Auto-delete failed:', error);
    }
}

// Run auto-delete check periodically if enabled
setInterval(() => {
    if (document.getElementById('autoDeleteToggle').checked) {
        runAutoDelete();
    }
}, 60000); // Check every minute

// ========================================
// QR CODE GENERATOR
// ========================================

function generateQRCode() {
    const tableNum = document.getElementById('qrTableNumber').value;
    const url = `${window.location.origin}${window.location.pathname.replace('admin.html', 'index.html')}?/table${tableNum}`;
    
    // Simple QR code using external API
    const qrPreview = document.getElementById('qrPreview');
    qrPreview.innerHTML = `
        <div style="text-align: center;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" 
                 alt="QR Code for Table ${tableNum}"
                 style="border-radius: var(--radius-md); margin-bottom: var(--spacing-md);">
            <p style="font-size: 0.875rem; color: var(--foreground-muted); word-break: break-all;">${url}</p>
        </div>
    `;
}

// ========================================
// NAVIGATION
// ========================================

function switchSection(sectionId) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });
    
    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId + 'Section');
    });
    
    currentSection = sectionId;
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            switchSection(item.dataset.section);
        });
    });
    
    // Menu Item Modal
    document.getElementById('addMenuItemBtn').addEventListener('click', () => openMenuItemModal());
    document.getElementById('menuModalClose').addEventListener('click', closeMenuItemModal);
    document.getElementById('menuModalCancel').addEventListener('click', closeMenuItemModal);
    menuItemForm.addEventListener('submit', handleMenuItemSubmit);
    
    // Menu filters
    document.getElementById('menuCategoryFilter').addEventListener('change', renderAdminMenuGrid);
    document.getElementById('menuSearchInput').addEventListener('input', renderAdminMenuGrid);
    
    // Offer Modal
    document.getElementById('addOfferBtn').addEventListener('click', () => openOfferModal());
    document.getElementById('offerModalClose').addEventListener('click', closeOfferModal);
    document.getElementById('offerModalCancel').addEventListener('click', closeOfferModal);
    offerForm.addEventListener('submit', handleOfferSubmit);
    
    // Orders filters
    document.getElementById('ordersDateFilter').addEventListener('change', renderAllOrdersTable);
    document.getElementById('ordersStatusFilter').addEventListener('change', renderAllOrdersTable);
    
    // Reports
    document.getElementById('exportDailyBtn').addEventListener('click', exportDailyReport);
    document.getElementById('exportWeeklyBtn').addEventListener('click', exportWeeklyReport);
    document.getElementById('exportMonthlyBtn').addEventListener('click', exportMonthlyReport);
    
    // QR Code
    document.getElementById('generateQRBtn').addEventListener('click', generateQRCode);
    
    // Settings form
    document.getElementById('restaurantForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Settings saved!');
    });
    
    // Close modals on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenuItemModal();
            closeOfferModal();
        }
    });
    
    // Close modals on overlay click
    menuItemModal.addEventListener('click', (e) => {
        if (e.target === menuItemModal) closeMenuItemModal();
    });
    offerModal.addEventListener('click', (e) => {
        if (e.target === offerModal) closeOfferModal();
    });
}
