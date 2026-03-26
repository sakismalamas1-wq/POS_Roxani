let currentOrder = [];

// ΤΟ ΜΕΝΟΥ ΣΟΥ ΑΠΕΥΘΕΙΑΣ ΕΔΩ (Για να μη χρειαζόμαστε το fetch τώρα)
const menuData = {
    "ΨΩΜΙ ΠΙΤΑ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα Εσπρέσσο", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "2 άρτος", "price": "1.20"}.
        {"name": "2 άρτος", "price": "1.20"}
        {"name": "2 άρτος", "price": "1.20"}
    ],
    "ΚΡΥΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΖΕΣΤΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΣΑΛΑΤΕΣ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΣΧΑΡΑΣ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΤΕΜΑΧΙΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΘΑΛΑΣΣΙΝΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΜΑΓΕΙΡΕΥΤΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΣΠΕΣΙΑΛ": [
        {"name": "Coca Cola", "price": "1.80"},
        {"name": "Πορτοκαλάδα", "price": "1.80"}
    ],
    "ΟΥΖΑ": [
        {"name": "Τοστ Ζαμπόν", "price": "2.20"},
        {"name": "Τοστ Γαλοπούλα", "price": "2.20"}
    ],
    "ΤΣΙΠΟΥΡΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΜΠΥΡΕΣ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΚΡΑΣΙΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΡΕΤΣΙΝΕΣ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΑΝΑΨΥΚΤΙΚΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΔΙΑΦΟΡΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "DELIVERY": [
        {"name": "κόστος delivery", "price": "1.00"},
        {"name": "κόστος delivery", "price": "2.00"}
    ]

};

function initApp() {
    console.log("Εκκίνηση...");
    
    // 1. Σχεδίαση Τραπεζιών
    const tableContainer = document.getElementById('tableContainer');
if (tableContainer) {
        tableContainer.innerHTML = ''; 
        const myTables = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45];
        
        myTables.forEach(num => {
            const tableBtn = document.createElement('button');
            tableBtn.innerText = "" + num;
            tableBtn.className = 'btn-table';
            tableBtn.onclick = () => alert("Επιλέχθηκε το Τραπέζι " + num);
            tableContainer.appendChild(tableBtn);
        });
    } // <--- Αυτή η αγκύλη κλείνει το if και πρέπει να υπάρχει!

    // 2. Εμφάνιση Κατηγοριών (Αμέσως!)
    renderCategories();
}

function renderCategories() {
    const categoriesDiv = document.getElementById('categories');
    if (!categoriesDiv) return;
    categoriesDiv.innerHTML = '';
    
    Object.keys(menuData).forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        // Προσθέτουμε μια κλάση αν έχεις στο CSS για τα κουμπιά κατηγοριών
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
        list.innerHTML = currentOrder.map(it => {
            total += parseFloat(it.price);
            return `<div style="padding:10px; border-bottom:1px solid #444; color:white;">
                        ${it.name} - ${it.price}€
                    </div>`;
        }).join('');
    }
    
    if (totalDisp) totalDisp.innerText = total.toFixed(2) + "€";
}

// Βοηθητικές για να μην κολλάει το HTML
function sendToKitchen() { alert("Στάλθηκε!"); }
function printFinalBill() { window.print(); }
function clearCurrentScreen() { currentOrder = []; updateOrderDisplay(); }
function startDelivery() { alert("Delivery Mode"); }
function checkCustomer() {}
function showDailyTotal() { alert("Σύνολο: " + document.getElementById('totalAmount').innerText); }