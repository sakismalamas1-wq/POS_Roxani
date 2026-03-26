let currentOrder = [];

// ΤΟ ΜΕΝΟΥ ΣΟΥ ΑΠΕΥΘΕΙΑΣ ΕΔΩ (Για να μη χρειαζόμαστε το fetch τώρα)
const menuData = {
    "ΚΑΦΕΔΕΣ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΑΝΑΨΥΚΤΙΚΑ": [
        {"name": "Coca Cola", "price": "1.80"},
        {"name": "Πορτοκαλάδα", "price": "1.80"}
    ],
    "ΤΟΑΣΤ": [
        {"name": "Τοστ Ζαμπόν", "price": "2.20"},
        {"name": "Τοστ Γαλοπούλα", "price": "2.20"}
    ]
};

function initApp() {
    console.log("Εκκίνηση...");
    
    // 1. Σχεδίαση Τραπεζιών
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
            const tableBtn = document.createElement('button');
            tableBtn.innerText = "Τρ. " + i;
            tableBtn.className = 'btn-table'; // Εδώ θα πάρει το στυλ από το CSS σου
            tableBtn.onclick = () => alert("Επιλέχθηκε το Τραπέζι " + i);
            tableContainer.appendChild(tableBtn);
        }
    }

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