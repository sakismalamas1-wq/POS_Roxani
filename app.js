let currentOrder = [];
let selectedTable = "Κανένα";

// ΕΔΩ ΕΙΝΑΙ ΤΟ ΜΕΝΟΥ ΣΟΥ - Μπορείς να προσθέτεις/αλλάζεις προϊόντα εδώ
const menuData = {
    "ΨΩΜΙ ΠΙΤΑ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
    "ΚΡΥΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΖΕΣΤΑ": [
        {"name": "Ελληνικός", "price": "1.50"},
        {"name": "Νεσκαφέ", "price": "2.00"}
    ],
    "ΑΝΑΨΥΚΤΙΚΑ": [
        {"name": "Coca Cola 330ml", "price": "2.00"},
        {"name": "Πορτοκαλάδα", "price": "2.00"}
    ]
};

function initApp() {
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = ''; 

        // 1. Κουμπί TAKE AWAY (Πορτοκαλί)
        const takeawayBtn = document.createElement('button');
        takeawayBtn.innerText = "TAKE AWAY";
        takeawayBtn.className = 'btn-table';
        takeawayBtn.style.backgroundColor = "#e67e22";
        // Όταν το πατάς, απλά αποθηκεύει την επιλογή, ΔΕΝ βγάζει ταμπελάκι
        takeawayBtn.onclick = () => { 
            selectedTable = "TAKE AWAY"; 
            updateOrderDisplay(); 
        };
        tableContainer.appendChild(takeawayBtn);

        // 2. Τραπέζια
        const myTables = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45];
        myTables.forEach(num => {
            const tableBtn = document.createElement('button');
            tableBtn.innerText = num;
            tableBtn.className = 'btn-table';
            // Όταν το πατάς, αλλάζει ο τίτλος στην απόδειξη
            tableBtn.onclick = () => { 
                selectedTable = "Τραπέζι " + num; 
                updateOrderDisplay(); 
            };
            tableContainer.appendChild(tableBtn);
        });
    }
    renderCategories();
}

function renderCategories() {
    const categoriesDiv = document.getElementById('categories');
    if (!categoriesDiv) return;
    categoriesDiv.innerHTML = '';
    Object.keys(menuData).forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.onclick = () => renderProducts(cat);
        categoriesDiv.appendChild(btn);
    });
}

function renderProducts(category) {
    const productsDiv = document.getElementById('products');
    if (!productsDiv) return;
    productsDiv.innerHTML = '';
    menuData[category].forEach(item => {
        const btn = document.createElement('button');
        btn.innerText = item.name + "\n" + item.price + "€";
        btn.onclick = () => {
            currentOrder.push(item);
            updateOrderDisplay();
        };
        productsDiv.appendChild(btn);
    });
}

function updateOrderDisplay() {
    const list = document.getElementById('orderList');
    const totalDisp = document.getElementById('totalAmount');
    let total = 0;
    
    if (list) {
        // Τίτλος Τραπεζιού σε ΜΑΥΡΟ χρώμα
        let html = `<h2 style="color:black; text-align:center; border-bottom:2px solid #e67e22; padding-bottom:10px;">${selectedTable}</h2>`;
        
        currentOrder.forEach((it) => {
            total += parseFloat(it.price);
            // Προϊόντα με ΜΑΥΡΑ γράμματα για να φαίνονται στο λευκό φόντο
            html += `<div style="padding:10px; border-bottom:1px solid #ccc; color:black; display:flex; justify-content:space-between; font-size:18px; font-weight:500;">
                        <span>${it.name}</span>
                        <span>${it.price}€</span>
                    </div>`;
        });
        list.innerHTML = html;
    }
    
    // Το σύνολο κάτω-κάτω σε ΜΑΥΡΟ
    if (totalDisp) {
        totalDisp.style.color = "black";
        totalDisp.innerText = total.toFixed(2) + "€";
    }
}

// Λοιπές συναρτήσεις για τα κουμπιά
function sendToKitchen() { alert("Στάλθηκε στην κουζίνα!"); }
function printFinalBill() { window.print(); }
function clearCurrentScreen() { currentOrder = []; selectedTable = "Κανένα"; updateOrderDisplay(); }
function startDelivery() { alert("Λειτουργία Delivery"); }
function checkCustomer() {}
function showDailyTotal() { alert("Σύνολο: " + document.getElementById('totalAmount').innerText); }