/* ========================================
   CUSTOMER MENU - MAIN SCRIPT
   ======================================== */

// State
let menuItems = [];
let cart = [];
let currentFilter = 'all';
let currentCategory = 'all';
let currentSort = 'default';
let searchQuery = '';
let restaurantId = 1;
let tableNumber = 1;
let currentOfferIndex = 0;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const tableNumberEl = document.getElementById('tableNumber');
const offersTrack = document.getElementById('offersTrack');
const offersDots = document.getElementById('offersDots');
const searchInput = document.getElementById('searchInput');
const categoriesScroll = document.getElementById('categoriesScroll');
const menuGrid = document.getElementById('menuGrid');
const menuSkeleton = document.getElementById('menuSkeleton');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');
const floatingCart = document.getElementById('floatingCart');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const successModal = document.getElementById('successModal');
const orderNumber = document.getElementById('orderNumber');
const successBtn = document.getElementById('successBtn');

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Parse URL parameters
    parseUrlParams();
    
    // Load data
    await Promise.all([
        loadMenu(),
        loadOffers()
    ]);
    
    // Setup event listeners
    setupEventListeners();
    
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 500);
});

function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    restaurantId = parseInt(params.get('restaurant')) || 1;
    
    // Check for table number in various formats: ?table=12, ?table12, ?/table12
    let foundTable = params.get('table');
    
    if (!foundTable) {
        // Search for 'table' followed by any number of digits in the whole query string
        const match = window.location.search.match(/table(\d+)/i);
        if (match) {
            foundTable = match[1];
        }
    }
    
    tableNumber = parseInt(foundTable) || 1;
    tableNumberEl.textContent = tableNumber;
    
    // Update navigation links to preserve table number
    document.querySelectorAll('.nav-link').forEach(link => {
        let href = link.getAttribute('href');
        if (href && href !== '/' && href !== '#') {
            // Append or update table parameter
            if (href.includes('?')) {
                if (href.includes('table=')) {
                    href = href.replace(/table=\d+/, `table=${tableNumber}`);
                } else {
                    href += `&table=${tableNumber}`;
                }
            } else {
                href += `?table=${tableNumber}`;
            }
            link.setAttribute('href', href);
        }
    });
}

// ========================================
// DATA LOADING
// ========================================

async function loadMenu() {
    menuSkeleton.classList.add('active');
    menuGrid.style.display = 'none';
    
    try {
        menuItems = await window.SupabaseDB.fetchMenu(restaurantId);
        renderCategories();
        renderMenu();
    } catch (error) {
        console.error('Failed to load menu:', error);
    } finally {
        menuSkeleton.classList.remove('active');
        menuGrid.style.display = 'grid';
    }
}

async function loadOffers() {
    try {
        const offers = await window.SupabaseDB.fetchOffers(restaurantId);
        renderOffers(offers);
        startOffersSlider(offers.length);
    } catch (error) {
        console.error('Failed to load offers:', error);
    }
}

// ========================================
// RENDERING
// ========================================

function renderCategories() {
    const categories = ['all', ...new Set(menuItems.map(item => item.category))];
    const categoryLabels = {
        'all': 'All',
        'starters': 'Starters',
        'biryani': 'Biryani',
        'mains': 'Main Course',
        'breads': 'Breads',
        'desserts': 'Desserts',
        'beverages': 'Beverages'
    };
    
    categoriesScroll.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === currentCategory ? 'active' : ''}" 
                data-category="${cat}">
            ${categoryLabels[cat] || cat}
        </button>
    `).join('');
}

function renderMenu() {
    let items = [...menuItems];
    
    // Apply filters
    if (currentFilter !== 'all') {
        switch (currentFilter) {
            case 'veg':
                items = items.filter(item => item.veg);
                break;
            case 'non-veg':
                items = items.filter(item => !item.veg);
                break;
            case 'spicy':
                items = items.filter(item => item.spicy);
                break;
        }
    }
    
    // Apply category filter
    if (currentCategory !== 'all') {
        items = items.filter(item => item.category === currentCategory);
    }
    
    // Apply search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        items = items.filter(item => 
            item.name.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    }
    
    // Apply sorting
    switch (currentSort) {
        case 'price-low':
            items.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            items.sort((a, b) => b.price - a.price);
            break;
    }
    
    // Render items
    menuGrid.innerHTML = items.map((item, index) => {
        const cartItem = cart.find(c => c.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        return `
            <article class="menu-card" data-id="${item.id}" style="animation-delay: ${index * 50}ms; animation: revealUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;">
                <div class="menu-card-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="menu-card-badges">
                        ${item.veg ? `
                            <span class="badge badge-veg">
                                <span class="veg-indicator"></span>
                                Veg
                            </span>
                        ` : `
                            <span class="badge badge-non-veg">
                                <span class="non-veg-indicator"></span>
                                Non-Veg
                            </span>
                        `}
                        ${item.spicy ? `
                            <span class="badge badge-spicy">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2c1.1 0 2 .9 2 2v2c3.31 0 6 2.69 6 6 0 1.85-.84 3.51-2.16 4.61L17 22H7l-.84-5.39C4.84 15.51 4 13.85 4 12c0-3.31 2.69-6 6-6V4c0-1.1.9-2 2-2z"/>
                                </svg>
                                Spicy
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="menu-card-content">
                    <div class="menu-card-header">
                        <h3 class="menu-card-name">${item.name}</h3>
                        <span class="menu-card-price">₹${item.price}</span>
                    </div>
                    <p class="menu-card-category">${item.category}</p>
                    <div class="menu-card-actions">
                        <button class="add-to-cart-btn ${quantity > 0 ? 'hidden' : ''}" 
                                onclick="addToCart(${item.id})">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Add to Cart
                        </button>
                        <div class="quantity-controls ${quantity > 0 ? 'active' : ''}">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="qty-value">${quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
    
    if (items.length === 0) {
        menuGrid.innerHTML = `
            <div class="no-items" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--foreground-muted);">
                <p>No items found matching your criteria.</p>
            </div>
        `;
    }
}

function renderOffers(offers) {
    if (offers.length === 0) return;
    
    offersTrack.innerHTML = offers.map(offer => `
        <div class="offer-slide">
            <div class="offer-slide-content">
                <h3>${offer.text}</h3>
                <p>Limited time offer</p>
            </div>
        </div>
    `).join('');
    
    offersDots.innerHTML = offers.map((_, index) => `
        <button class="offer-dot ${index === 0 ? 'active' : ''}" 
                data-index="${index}"></button>
    `).join('');
}

function startOffersSlider(count) {
    if (count <= 1) return;
    
    setInterval(() => {
        currentOfferIndex = (currentOfferIndex + 1) % count;
        updateOffersSlider();
    }, 4000);
}

function updateOffersSlider() {
    offersTrack.style.transform = `translateX(-${currentOfferIndex * 100}%)`;
    
    document.querySelectorAll('.offer-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentOfferIndex);
    });
}

// ========================================
// CART FUNCTIONS
// ========================================

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(c => c.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }
    
    updateCartUI();
    renderMenu();
    
    // Animate cart button
    floatingCart.style.transform = 'scale(1.2)';
    setTimeout(() => {
        floatingCart.style.transform = '';
    }, 200);
}

function updateQuantity(itemId, delta) {
    const cartItem = cart.find(c => c.id === itemId);
    if (!cartItem) return;
    
    cartItem.quantity += delta;
    
    if (cartItem.quantity <= 0) {
        cart = cart.filter(c => c.id !== itemId);
    }
    
    updateCartUI();
    renderMenu();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart sidebar
    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartFooter.style.display = 'none';
        cartItems.innerHTML = '';
        cartItems.appendChild(cartEmpty);
    } else {
        cartEmpty.style.display = 'none';
        cartFooter.style.display = 'block';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <span class="cart-item-price">₹${item.price * item.quantity}</span>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Update totals
    cartSubtotal.textContent = `₹${subtotal}`;
    cartTotal.textContent = `₹${subtotal}`;
    
    // Update place order button
    placeOrderBtn.disabled = cart.length === 0;
}

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// ORDER FUNCTIONS
// ========================================

async function placeOrderHandler() {
    if (cart.length === 0) return;
    
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<span class="loading-spinner"></span> Placing Order...';
    
    try {
        // Place each item as an individual order in Firebase as requested
        for (const item of cart) {
            await window.FirebaseService.placeOrder(
                item.name, 
                item.price, 
                tableNumber, 
                item.quantity
            );
        }
        
        // Show confirmation alert as requested
        alert("Order sent to kitchen");
        
        // Clear cart and update UI
        cart = [];
        updateCartUI();
        filterAndRenderMenu(); // Re-render the menu
        closeCart();
        
        // Still show the success modal for consistency with the premium UI
        successModal.classList.add('active');
    } catch (error) {
        console.error('Failed to place order:', error);
        let errorMessage = 'Failed to place order. Please try again.';
        if (error.code === 'permission-denied') {
            errorMessage = 'Order failed: Permission Denied. Please check your Firestore security rules to allow writes to the \'orders\' collection.';
        }
        alert(errorMessage);
    } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = '<span>Place Order</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }
}

function closeSuccessModal() {
    successModal.classList.remove('active');
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value;
        renderMenu();
    }, 300));
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderMenu();
        });
    });
    
    // Sort options
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', () => {
            currentSort = option.dataset.sort;
            renderMenu();
        });
    });
    
    // Categories
    categoriesScroll.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            renderMenu();
        }
    });
    
    // Offer dots
    offersDots.addEventListener('click', (e) => {
        if (e.target.classList.contains('offer-dot')) {
            currentOfferIndex = parseInt(e.target.dataset.index);
            updateOffersSlider();
        }
    });
    
    // Cart
    floatingCart.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    placeOrderBtn.addEventListener('click', placeOrderHandler);
    
    // Success modal
    successBtn.addEventListener('click', closeSuccessModal);
    
    // Close modal on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeSuccessModal();
        }
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
