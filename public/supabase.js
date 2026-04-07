/* ========================================
   SUPABASE CONFIGURATION & PLACEHOLDER FUNCTIONS
   ======================================== */

// Supabase Configuration - Replace with your actual credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase Client (uncomment when ready)
// const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========================================
// PLACEHOLDER DATA (for demonstration)
// ========================================

const DEMO_MENU = [
    // STARTERS (10 items)
    { id: 1, restaurant_id: 1, name: "Masala Papad", price: 40, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop", category: "starters", spicy: true, veg: true, available: true },
    { id: 2, restaurant_id: 1, name: "Paneer Tikka", price: 180, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop", category: "starters", spicy: true, veg: true, available: true },
    { id: 3, restaurant_id: 1, name: "Chicken 65", price: 220, image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&h=300&fit=crop", category: "starters", spicy: true, veg: false, available: true },
    { id: 4, restaurant_id: 1, name: "Gobi Manchurian", price: 160, image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400&h=300&fit=crop", category: "starters", spicy: true, veg: true, available: true },
    { id: 5, restaurant_id: 1, name: "Mutton Seekh Kebab", price: 280, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop", category: "starters", spicy: true, veg: false, available: true },
    { id: 6, restaurant_id: 1, name: "Onion Bhaji", price: 80, image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop", category: "starters", spicy: false, veg: true, available: true },
    { id: 7, restaurant_id: 1, name: "Fish Fry", price: 250, image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400&h=300&fit=crop", category: "starters", spicy: true, veg: false, available: true },
    { id: 8, restaurant_id: 1, name: "Aloo Tikki", price: 90, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop", category: "starters", spicy: false, veg: true, available: true },
    { id: 9, restaurant_id: 1, name: "Prawn Pakora", price: 290, image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop", category: "starters", spicy: true, veg: false, available: true },
    { id: 10, restaurant_id: 1, name: "Samosa (2 pcs)", price: 60, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop", category: "starters", spicy: true, veg: true, available: true },

    // BIRYANI (8 items)
    { id: 11, restaurant_id: 1, name: "Chicken Biryani", price: 220, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", category: "biryani", spicy: true, veg: false, available: true },
    { id: 12, restaurant_id: 1, name: "Mutton Biryani", price: 280, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", category: "biryani", spicy: true, veg: false, available: true },
    { id: 13, restaurant_id: 1, name: "Veg Biryani", price: 180, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop", category: "biryani", spicy: true, veg: true, available: true },
    { id: 14, restaurant_id: 1, name: "Egg Biryani", price: 180, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", category: "biryani", spicy: true, veg: false, available: true },
    { id: 15, restaurant_id: 1, name: "Prawn Biryani", price: 320, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", category: "biryani", spicy: true, veg: false, available: true },
    { id: 16, restaurant_id: 1, name: "Fish Biryani", price: 280, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", category: "biryani", spicy: true, veg: false, available: true },
    { id: 17, restaurant_id: 1, name: "Paneer Biryani", price: 200, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop", category: "biryani", spicy: true, veg: true, available: true },
    { id: 18, restaurant_id: 1, name: "Special Madurai Biryani", price: 350, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop", category: "biryani", spicy: true, veg: false, available: true },

    // MAIN COURSE - VEG (8 items)
    { id: 19, restaurant_id: 1, name: "Paneer Butter Masala", price: 220, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop", category: "mains", spicy: false, veg: true, available: true },
    { id: 20, restaurant_id: 1, name: "Dal Tadka", price: 140, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop", category: "mains", spicy: false, veg: true, available: true },
    { id: 21, restaurant_id: 1, name: "Palak Paneer", price: 200, image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=400&h=300&fit=crop", category: "mains", spicy: false, veg: true, available: true },
    { id: 22, restaurant_id: 1, name: "Chana Masala", price: 160, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop", category: "mains", spicy: true, veg: true, available: true },
    { id: 23, restaurant_id: 1, name: "Aloo Gobi", price: 150, image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&h=300&fit=crop", category: "mains", spicy: false, veg: true, available: true },
    { id: 24, restaurant_id: 1, name: "Kadai Paneer", price: 230, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop", category: "mains", spicy: true, veg: true, available: true },
    { id: 25, restaurant_id: 1, name: "Malai Kofta", price: 240, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop", category: "mains", spicy: false, veg: true, available: true },
    { id: 26, restaurant_id: 1, name: "Bhindi Masala", price: 160, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop", category: "mains", spicy: false, veg: true, available: true },

    // MAIN COURSE - NON-VEG (8 items)
    { id: 27, restaurant_id: 1, name: "Butter Chicken", price: 280, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop", category: "mains", spicy: false, veg: false, available: true },
    { id: 28, restaurant_id: 1, name: "Chicken Chettinad", price: 260, image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&h=300&fit=crop", category: "mains", spicy: true, veg: false, available: true },
    { id: 29, restaurant_id: 1, name: "Mutton Rogan Josh", price: 320, image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop", category: "mains", spicy: true, veg: false, available: true },
    { id: 30, restaurant_id: 1, name: "Fish Curry", price: 260, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop", category: "mains", spicy: true, veg: false, available: true },
    { id: 31, restaurant_id: 1, name: "Prawn Masala", price: 340, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop", category: "mains", spicy: true, veg: false, available: true },
    { id: 32, restaurant_id: 1, name: "Egg Curry", price: 160, image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop", category: "mains", spicy: true, veg: false, available: true },
    { id: 33, restaurant_id: 1, name: "Chicken Korma", price: 270, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop", category: "mains", spicy: false, veg: false, available: true },
    { id: 34, restaurant_id: 1, name: "Mutton Keema", price: 300, image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop", category: "mains", spicy: true, veg: false, available: true },

    // BREADS (6 items)
    { id: 35, restaurant_id: 1, name: "Butter Naan", price: 50, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop", category: "breads", spicy: false, veg: true, available: true },
    { id: 36, restaurant_id: 1, name: "Garlic Naan", price: 60, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop", category: "breads", spicy: false, veg: true, available: true },
    { id: 37, restaurant_id: 1, name: "Tandoori Roti", price: 30, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop", category: "breads", spicy: false, veg: true, available: true },
    { id: 38, restaurant_id: 1, name: "Paratha", price: 50, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop", category: "breads", spicy: false, veg: true, available: true },
    { id: 39, restaurant_id: 1, name: "Kulcha", price: 55, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop", category: "breads", spicy: false, veg: true, available: true },
    { id: 40, restaurant_id: 1, name: "Cheese Naan", price: 80, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop", category: "breads", spicy: false, veg: true, available: true },

    // DESSERTS (6 items)
    { id: 41, restaurant_id: 1, name: "Gulab Jamun (2 pcs)", price: 80, image: "https://images.unsplash.com/photo-1666190094762-2211ddbe295b?w=400&h=300&fit=crop", category: "desserts", spicy: false, veg: true, available: true },
    { id: 42, restaurant_id: 1, name: "Rasmalai (2 pcs)", price: 100, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop", category: "desserts", spicy: false, veg: true, available: true },
    { id: 43, restaurant_id: 1, name: "Jalebi", price: 60, image: "https://images.unsplash.com/photo-1666190094762-2211ddbe295b?w=400&h=300&fit=crop", category: "desserts", spicy: false, veg: true, available: true },
    { id: 44, restaurant_id: 1, name: "Kheer", price: 90, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop", category: "desserts", spicy: false, veg: true, available: true },
    { id: 45, restaurant_id: 1, name: "Ice Cream (Vanilla/Chocolate)", price: 80, image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop", category: "desserts", spicy: false, veg: true, available: true },
    { id: 46, restaurant_id: 1, name: "Gajar Ka Halwa", price: 100, image: "https://images.unsplash.com/photo-1666190094762-2211ddbe295b?w=400&h=300&fit=crop", category: "desserts", spicy: false, veg: true, available: true },

    // BEVERAGES (6 items)
    { id: 47, restaurant_id: 1, name: "Masala Chai", price: 30, image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop", category: "beverages", spicy: false, veg: true, available: true },
    { id: 48, restaurant_id: 1, name: "Filter Coffee", price: 40, image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop", category: "beverages", spicy: false, veg: true, available: true },
    { id: 49, restaurant_id: 1, name: "Mango Lassi", price: 80, image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop", category: "beverages", spicy: false, veg: true, available: true },
    { id: 50, restaurant_id: 1, name: "Fresh Lime Soda", price: 50, image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop", category: "beverages", spicy: false, veg: true, available: true },
    { id: 51, restaurant_id: 1, name: "Buttermilk (Chaas)", price: 40, image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop", category: "beverages", spicy: false, veg: true, available: true },
    { id: 52, restaurant_id: 1, name: "Mineral Water", price: 30, image: "https://images.unsplash.com/photo-1606168094336-48f205276929?w=400&h=300&fit=crop", category: "beverages", spicy: false, veg: true, available: true }
];

const DEMO_OFFERS = [
    { id: 1, restaurant_id: 1, text: "20% OFF on all Biryani - Today Only!", image: null },
    { id: 2, restaurant_id: 1, text: "Free Gulab Jamun with orders above ₹500", image: null },
    { id: 3, restaurant_id: 1, text: "Lunch Special: Biryani + Raita @ ₹199", image: null },
    { id: 4, restaurant_id: 1, text: "Family Pack: 4 Biryani + 2 Starters @ ₹999", image: null }
];

// Orders storage (simulates database)
let DEMO_ORDERS = JSON.parse(localStorage.getItem('demo_orders')) || [];

// ========================================
// DATABASE FUNCTIONS (Placeholder)
// ========================================

/**
 * Fetch menu items from database
 * @param {number} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Menu items
 */
async function fetchMenu(restaurantId = 1) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    /* 
    // Supabase implementation:
    const { data, error } = await supabase
        .from('menu')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('available', true);
    
    if (error) throw error;
    return data;
    */
    
    return DEMO_MENU.filter(item => item.restaurant_id === restaurantId && item.available);
}

/**
 * Fetch all menu items (including unavailable) for admin
 * @param {number} restaurantId - Restaurant ID
 * @returns {Promise<Array>} All menu items
 */
async function fetchAllMenu(restaurantId = 1) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    /*
    const { data, error } = await supabase
        .from('menu')
        .select('*')
        .eq('restaurant_id', restaurantId);
    
    if (error) throw error;
    return data;
    */
    
    return DEMO_MENU.filter(item => item.restaurant_id === restaurantId);
}

/**
 * Add new menu item
 * @param {Object} item - Menu item data
 * @returns {Promise<Object>} Created item
 */
async function addMenuItem(item) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    /*
    const { data, error } = await supabase
        .from('menu')
        .insert([item])
        .select()
        .single();
    
    if (error) throw error;
    return data;
    */
    
    const newItem = {
        ...item,
        id: Math.max(...DEMO_MENU.map(i => i.id)) + 1
    };
    DEMO_MENU.push(newItem);
    return newItem;
}

/**
 * Update menu item
 * @param {number} id - Item ID
 * @param {Object} updates - Updated data
 * @returns {Promise<Object>} Updated item
 */
async function updateMenuItem(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    /*
    const { data, error } = await supabase
        .from('menu')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw error;
    return data;
    */
    
    const index = DEMO_MENU.findIndex(item => item.id === id);
    if (index !== -1) {
        DEMO_MENU[index] = { ...DEMO_MENU[index], ...updates };
        return DEMO_MENU[index];
    }
    throw new Error('Item not found');
}

/**
 * Delete menu item
 * @param {number} id - Item ID
 * @returns {Promise<void>}
 */
async function deleteMenuItem(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    /*
    const { error } = await supabase
        .from('menu')
        .delete()
        .eq('id', id);
    
    if (error) throw error;
    */
    
    const index = DEMO_MENU.findIndex(item => item.id === id);
    if (index !== -1) {
        DEMO_MENU.splice(index, 1);
    }
}

/**
 * Fetch offers from database
 * @param {number} restaurantId - Restaurant ID
 * @returns {Promise<Array>} Offers
 */
async function fetchOffers(restaurantId = 1) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    /*
    const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('restaurant_id', restaurantId);
    
    if (error) throw error;
    return data;
    */
    
    return DEMO_OFFERS.filter(offer => offer.restaurant_id === restaurantId);
}

/**
 * Add new offer
 * @param {Object} offer - Offer data
 * @returns {Promise<Object>} Created offer
 */
async function addOffer(offer) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    /*
    const { data, error } = await supabase
        .from('offers')
        .insert([offer])
        .select()
        .single();
    
    if (error) throw error;
    return data;
    */
    
    const newOffer = {
        ...offer,
        id: Math.max(...DEMO_OFFERS.map(o => o.id), 0) + 1
    };
    DEMO_OFFERS.push(newOffer);
    return newOffer;
}

/**
 * Update offer
 * @param {number} id - Offer ID
 * @param {Object} updates - Updated data
 * @returns {Promise<Object>} Updated offer
 */
async function updateOffer(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = DEMO_OFFERS.findIndex(offer => offer.id === id);
    if (index !== -1) {
        DEMO_OFFERS[index] = { ...DEMO_OFFERS[index], ...updates };
        return DEMO_OFFERS[index];
    }
    throw new Error('Offer not found');
}

/**
 * Delete offer
 * @param {number} id - Offer ID
 * @returns {Promise<void>}
 */
async function deleteOffer(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = DEMO_OFFERS.findIndex(offer => offer.id === id);
    if (index !== -1) {
        DEMO_OFFERS.splice(index, 1);
    }
}

/**
 * Place a new order
 * @param {Object} orderData - Order details
 * @returns {Promise<Object>} Created order
 */
async function placeOrder(orderData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    /*
    const { data, error } = await supabase
        .from('orders')
        .insert([{
            restaurant_id: orderData.restaurant_id,
            table_number: orderData.table_number,
            items: orderData.items,
            total_price: orderData.total_price,
            status: 'pending',
            created_at: new Date().toISOString()
        }])
        .select()
        .single();
    
    if (error) throw error;
    return data;
    */
    
    const newOrder = {
        id: Math.max(...DEMO_ORDERS.map(o => o.id), 0) + 1,
        restaurant_id: orderData.restaurant_id || 1,
        table_number: orderData.table_number,
        items: orderData.items,
        total_price: orderData.total_price,
        status: 'pending',
        created_at: new Date().toISOString()
    };
    
    DEMO_ORDERS.push(newOrder);
    saveOrders();
    
    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent('newOrder', { detail: newOrder }));
    
    return newOrder;
}

/**
 * Fetch orders
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Orders
 */
async function fetchOrders(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    /*
    let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (filters.restaurant_id) {
        query = query.eq('restaurant_id', filters.restaurant_id);
    }
    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.date) {
        query = query.gte('created_at', filters.date);
    }
    if (filters.table_number) {
        query = query.eq('table_number', filters.table_number);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
    */
    
    let orders = [...DEMO_ORDERS];
    
    if (filters.restaurant_id) {
        orders = orders.filter(o => o.restaurant_id === filters.restaurant_id);
    }
    if (filters.status && filters.status !== 'all') {
        orders = orders.filter(o => o.status === filters.status);
    }
    if (filters.date) {
        const filterDate = new Date(filters.date);
        orders = orders.filter(o => new Date(o.created_at) >= filterDate);
    }
    if (filters.table_number) {
        orders = orders.filter(o => o.table_number === filters.table_number);
    }
    
    return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Listen for new orders (real-time)
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
function listenForOrders(callback) {
    /*
    const subscription = supabase
        .channel('orders')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'orders' }, 
            payload => {
                callback(payload);
            }
        )
        .subscribe();
    
    return () => subscription.unsubscribe();
    */
    
    // Simulate real-time with event listener
    const handler = (event) => {
        callback({ eventType: 'INSERT', new: event.detail });
    };
    
    window.addEventListener('newOrder', handler);
    window.addEventListener('orderUpdated', handler);
    
    return () => {
        window.removeEventListener('newOrder', handler);
        window.removeEventListener('orderUpdated', handler);
    };
}

/**
 * Update order status
 * @param {number} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
async function updateOrderStatus(orderId, status) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    /*
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
    */
    
    const index = DEMO_ORDERS.findIndex(o => o.id === orderId);
    if (index !== -1) {
        DEMO_ORDERS[index].status = status;
        saveOrders();
        
        window.dispatchEvent(new CustomEvent('orderUpdated', { 
            detail: DEMO_ORDERS[index] 
        }));
        
        return DEMO_ORDERS[index];
    }
    throw new Error('Order not found');
}

/**
 * Delete order
 * @param {number} orderId - Order ID
 * @returns {Promise<void>}
 */
async function deleteOrder(orderId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    /*
    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
    
    if (error) throw error;
    */
    
    const index = DEMO_ORDERS.findIndex(o => o.id === orderId);
    if (index !== -1) {
        DEMO_ORDERS.splice(index, 1);
        saveOrders();
    }
}

/**
 * Export daily sales to CSV
 * @param {Date} date - Date to export
 * @returns {Promise<string>} CSV content
 */
async function exportDailySales(date = new Date()) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    /*
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .eq('status', 'completed');
    
    if (error) throw error;
    */
    
    const orders = DEMO_ORDERS.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= startOfDay && orderDate <= endOfDay;
    });
    
    // Generate CSV
    const headers = ['Order ID', 'Table', 'Items', 'Total', 'Status', 'Time'];
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
    
    return csv;
}

/**
 * Delete orders older than 24 hours
 * @returns {Promise<number>} Number of deleted orders
 */
async function deleteOldOrders() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24);
    
    /*
    const { data, error } = await supabase
        .from('orders')
        .delete()
        .lt('created_at', cutoff.toISOString())
        .eq('status', 'completed');
    
    if (error) throw error;
    return data.length;
    */
    
    const initialLength = DEMO_ORDERS.length;
    DEMO_ORDERS = DEMO_ORDERS.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= cutoff || o.status !== 'completed';
    });
    saveOrders();
    
    return initialLength - DEMO_ORDERS.length;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function saveOrders() {
    localStorage.setItem('demo_orders', JSON.stringify(DEMO_ORDERS));
}

// Export functions for use in other files
window.SupabaseDB = {
    fetchMenu,
    fetchAllMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    fetchOffers,
    addOffer,
    updateOffer,
    deleteOffer,
    placeOrder,
    fetchOrders,
    listenForOrders,
    updateOrderStatus,
    deleteOrder,
    exportDailySales,
    deleteOldOrders
};
