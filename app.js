let currentOrder = [];

const menuData = {
    "ΨΩΜΙ ΠΙΤΑ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"},
        {"name": "πίτα ολικής", "price": "0.70"},
        {"name": "καλαμπόκι πίτα", "price": "0.70"}
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
        {"name": "Χωριάτικη", "price": "6.00"},
        {"name": "Αγγουροντομάτα", "price": "4.00"}
    ],
    "ΣΧΑΡΑΣ": [
        {"name": "Σουβλάκι", "price": "2.00"},
        {"name": "Μπιφτέκι", "price": "2.50"}
    ],
    "ΤΕΜΑΧΙΑ": [
        {"name": "Σουτζουκάκι", "price": "1.50"}
    ],
    "ΘΑΛΑΣΣΙΝΑ": [
        {"name": "Καλαμαράκια", "price": "7.00"}
    ],
    "ΜΑΓΕΙΡΕΥΤΑ": [
        {"name": "Μουσακάς", "price": "8.00"}
    ],
    "ΣΠΕΣΙΑΛ": [
        {"name": "Ποικιλία", "price": "15.00"}
    ],
    "ΟΥΖΑ": [
        {"name": "Ούζο 200ml", "price": "7.00"}
    ],
    "ΤΣΙΠΟΥΡΑ": [
        {"name": "Τσίπουρο 200ml", "price": "7.50"}
    ],
    "ΜΠΥΡΕΣ": [
        {"name": "Άλφα 500ml", "price": "3.50"},
        {"name": "Fix 500ml", "price": "3.50"}
    ],
    "ΚΡΑΣΙΑ": [
        {"name": "Κρασί Λευκό 500ml", "price": "4.00"}
    ],
    "ΡΕΤΣΙΝΕΣ": [
        {"name": "Κεχριμπάρι", "price": "4.50"}
    ],
    "ΑΝΑΨΥΚΤΙΚΑ": [
        {"name": "Coca Cola 330ml", "price": "2.00"},
        {"name": "Πορτοκαλάδα", "price": "2.00"}
    ],
    "ΔΙΑΦΟΡΑ": [
        {"name": "Νερό 1.5L", "price": "1.00"}
    ],
    "DELIVERY": [
        {"name": "κόστος delivery", "price": "1.00"},
        {"name": "κόστος delivery 2", "price": "2.00"}
}

function initApp() {
    console.log("Εκκίνηση...");
    const tableContainer = document.getElementById('tableContainer');
    
    if (tableContainer) {
        tableContainer.innerHTML = ''; 

        // 1. Κουμπί TAKE AWAY (Πορτοκαλί και μεγάλο)
        const takeawayBtn = document.createElement('button');
        takeawayBtn.innerText = "TAKE AWAY";
        takeawayBtn.className = 'btn-table';
        takeawayBtn.style.backgroundColor = "#e67e22";
        takeawayBtn.style.color = "white";
        takeawayBtn.style.fontWeight = "bold";
        takeawayBtn.onclick = () => alert("Επιλέχθηκε TAKE AWAY");
        tableContainer.appendChild(takeawayBtn);

        // 2. Τα τραπέζια σου
        const myTables = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45];
        
        myTables.forEach(num => {
            const tableBtn = document.createElement('button');
            tableBtn.innerText = num;
            tableBtn.className = 'btn-table';
            tableBtn.onclick = () => alert("Επιλέχθηκε το Τραπέζι " + num);
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
        list.innerHTML = currentOrder.map(it => {
            total += parseFloat(it.price);
            return `<div style="padding:10px; border-bottom:1px solid #444; color:white; font-size:18px;">
                        ${it.name} - ${it.price}€
                    </div>`;
        }).join('');
    }
    
    if (totalDisp) totalDisp.innerText = total.toFixed(2) + "€";
}

function sendToKitchen() { alert("Στάλθηκε!"); }
function printFinalBill() { window.print(); }
function clearCurrentScreen() { currentOrder = []; updateOrderDisplay(); }
function startDelivery() { alert("Delivery Mode"); }
function checkCustomer() {}
function showDailyTotal() { alert("Σύνολο: " + document.getElementById('totalAmount').innerText); }