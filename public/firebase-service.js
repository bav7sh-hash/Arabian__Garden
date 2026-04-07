import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp, 
    onSnapshot, 
    query, 
    orderBy, 
    doc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Places an order in Firestore
 * @param {string} itemName 
 * @param {number} price 
 * @param {number} tableNumber 
 * @param {number} quantity 
 */
export async function placeOrder(itemName, price, tableNumber, quantity) {
    try {
        const orderRef = collection(db, "orders");
        await addDoc(orderRef, {
            itemName,
            price,
            tableNumber,
            quantity,
            status: "pending",
            timestamp: serverTimestamp()
        });
        console.log("Order placed successfully");
        return true;
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
}

/**
 * Listens to orders in realtime
 * @param {function} callback - Function to handle the updated orders list
 */
export function listenToOrders(callback) {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("timestamp", "desc"));
    
    return onSnapshot(q, (snapshot) => {
        const orders = [];
        snapshot.forEach((doc) => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        callback(orders);
    });
}

/**
 * Updates an order status to "prepared"
 * @param {string} orderId 
 */
export async function markAsPrepared(orderId) {
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            status: "prepared"
        });
        return true;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
}

// Expose to window for non-module scripts if needed
window.FirebaseService = {
    placeOrder,
    listenToOrders,
    markAsPrepared
};
