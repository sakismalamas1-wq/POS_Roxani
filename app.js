// 1. ΑΡΧΙΚΕΣ ΜΕΤΑΒΛΗΤΕΣ (ΑΠΑΡΑΙΤΗΤΕΣ)
let currentOrder = [];
let selectedTable = "Κανένα";
let tableOrders = {}; // Εδώ σώζονται τα κίτρινα τραπέζια
let lastAddedItem = null;

// 2. ΤΑ EXTRAS (Όπως στη φωτογραφία σου)
const allExtras = [
    { name: "ΨΩΜΙ", price: 0 }, { name: "ΠΙΤΑ", price: 0 },
    { name: "ΑΠΟΛΑ", price: 0 }, { name: "ΠΑΤΑΤΕΣ", price: 0 },
    { name: "ΝΤΟΜΑΤΑ", price: 0 }, { name: "ΚΡΕΜΜΥΔΙ", price: 0 },
    { name: "ΜΟΥΣΤΑΡΔΑ", price: 0 }, { name: "ΚΕΤΣΑΠ", price: 0 },
    { name: "ΜΑΓΙΟΝΕΖΑ", price: 0 }, { name: "TZATZIKI", price: 0.30 },
    { name: "ΧΤΥΠΗΤΗ", price: 0.30 }
];

// 3. ΤΟ ΜΕΝΟΥ ΣΟΥ
const menuData = {
    "ΨΩΜΙ ΠΙΤΑ": [
        {"name": "ψωμάκι", "price": "0.60"}, {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"}, {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
    "ΣΑΝΤΟΥΙΤΣ": [
        {"name": "Σ. ΣΟΥΒΛΑΚΙ", "price": "3.50"}, {"name": "Σ. ΜΠΙΦΤΕΚΙ", "price": "3.80"},
        {"name": "Σ. ΠΑΝΣΕΤΑ", "price": "3.80"}, {"name": "Σ. ΛΟΥΚΑΝΙΚΟ", "price": "3.50"}
    ],
    "ΣΧΑΡΑΣ": [
        {"name": "Σουβλάκι τεμ.", "price": "1.80"}, {"name": "Μπιφτέκι τεμ.", "price": "2.00"}
    ],
    "ΑΝΑΨΥΚΤΙΚΑ": [
        {"name": "ΚΟΚΑ ΚΟΛΑ", "price": "2.00"}, {"name": "ΠΟΡΤΟΚΑΛΑΔΑ", "price": "2.00"},
        {"name": "ΛΕΜΟΝΑΔΑ", "price": "2.00"}, {"name": "ΣΟΔΑ", "price": "2.00"},
        {"name": "ΝΕΡΟ 1L", "price": "1.20"}
    ],
    "DELIVERY": [
        {"name": "κόστος delivery", "price": "1.00"}, {"name": "κόστος delivery", "price": "2.00"}
    ]
};

// 4. ΕΚΚΙΝΗΣΗ ΕΦΑΡΜΟΓΗΣ
function initApp() {
    const tableContainer = document.getElementById('tableContainer');
    if (!tableContainer) return;
    tableContainer.innerHTML = ''; 

    // Κουμπί TAKE AWAY
    const takeawayBtn = document.createElement('button');
    takeawayBtn.innerText = "TAKE AWAY";
    takeawayBtn.className = 'btn-table';
    takeawayBtn.style.backgroundColor = "#e67e22";
    takeawayBtn.onclick = () => { selectedTable = "TAKE AWAY"; currentOrder = tableOrders["TAKE AWAY"] || []; updateOrderDisplay(); };
    tableContainer.appendChild(takeawayBtn);

    // Δημιουργία Τραπεζιών
    const myTables = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45];
    myTables.forEach(num => {
        const tableBtn = document.createElement('button');
        tableBtn.innerText = num;
        tableBtn.id = "btn-table-" + num;
        tableBtn.className = 'btn-table';
        
        // Έλεγχος αν είναι κίτρινο (έχει παραγγελία)
        if (tableOrders[num] && tableOrders[num].length > 0) {
            tableBtn.style.backgroundColor = "yellow";
            tableBtn.style.color = "black";
        }

        tableBtn.onclick = () => { 
            selectedTable = "Τραπέζι " + num;
            currentOrder = tableOrders[num] || []; 
            updateOrderDisplay(); 
        };
        tableContainer.appendChild(tableBtn);
    });
    renderCategories();
}

// 5. ΔΙΑΧΕΙΡΙΣΗ ΜΕΝΟΥ & ΠΡΟΪΟΝΤΩΝ
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
            if (selectedTable === "Κανένα") { alert("Επιλέξτε πρώτα Τραπέζι!"); return; }
            
            let newItem = { ...item, note: "" };
            currentOrder.push(newItem);
            lastAddedItem = newItem;

            // Σώζουμε στο τραπέζι και το κάνουμε κίτρινο
            saveTableOrder();

            // Ανοίγει το Modal για Extras (εκτός από Αναψυκτικά/Delivery)
            if (category !== "ΑΝΑΨΥΚΤΙΚΑ" && category !== "DELIVERY") {
                openExtrasModal(newItem);
            }
            updateOrderDisplay();
        };
        productsDiv.appendChild(btn);
    });
}

// 6. ΤΑ EXTRAS (MODAL)
function openExtrasModal(item) {
    const modal = document.getElementById('extrasModal');
    const container = document.getElementById('extrasButtons');
    if (!modal || !container) return;

    modal.style.display = "block";
    container.innerHTML = '';

    allExtras.forEach(ex => {
        const btn = document.createElement('button');
        btn.innerText = ex.name + (ex.price > 0 ? " +" + ex.price : "");
        btn.className = 'btn-modal-extra'; 
        btn.onclick = () => {
            item.note += (item.note ? ", " : "") + ex.name;
            item.price = (parseFloat(item.price) + ex.price).toFixed(2);
            btn.style.backgroundColor = "#27ae60"; 
            updateOrderDisplay();
        };
        container.appendChild(btn);
    });
}

function closeExtras() { document.getElementById('extrasModal').style.display = "none"; }

// 7. ΕΝΗΜΕΡΩΣΗ ΟΘΟΝΗΣ & ΤΡΑΠΕΖΙΩΝ
function saveTableOrder() {
    let key = selectedTable.replace("Τραπέζι ", "");
    tableOrders[key] = currentOrder;
    const btn = document.getElementById("btn-table-" + key);
    if (btn) { btn.style.backgroundColor = "yellow"; btn.style.color = "black"; }
}

function updateOrderDisplay() {
    const list = document.getElementById('orderList');
    const totalDisp = document.getElementById('totalAmount');
    let total = 0;
    
    if (list) {
        let html = `<h2 style="color:black; text-align:center; border-bottom:2px solid #e67e22; padding-bottom:10px;">${selectedTable}</h2>`;
        currentOrder.forEach((it) => {
            total += parseFloat(it.price);
            html += `<div style="padding:10px; border-bottom:1px solid #ccc; color:black; font-size:18px;">
                        <div style="display:flex; justify-content:space-between; font-weight:bold;">
                            <span>${it.name}</span><span>${it.price}€</span>
                        </div>`;
            if(it.note) html += `<div style="color:red; font-size:14px; font-style:italic;">* ${it.note}</div>`;
            html += `</div>`;
        });
        list.innerHTML = html;
    }
    if (totalDisp) totalDisp.innerText = total.toFixed(2) + "€";
}

// 8. ΕΚΤΥΠΩΣΕΙΣ
function sendToKitchen() {
    let kitchenHTML = `<div style="width: 80mm; font-family: monospace; color: black; padding: 10px;">
        <h2 style="text-align:center; border-bottom:1px solid #000;">ΠΑΡΑΓΓΕΛΙΑ</h2>
        <h3 style="text-align:center;">${selectedTable}</h3>`;
    currentOrder.forEach(it => {
        kitchenHTML += `<div style="font-size: 18px; font-weight: bold;">- ${it.name} ${it.note ? '['+it.note+']' : ''}</div>`;
    });
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write('<html><body onload="window.print();window.close()">' + kitchenHTML + '</body></html>');
    printWindow.document.close();
}

function printFinalBill() {
    let receiptHTML = `<div style="width: 80mm; font-family: monospace; color: black; padding: 10px;">
        <h2 style="text-align:center;">ΡΩΞΑΝΗ</h2>
        <h3 style="text-align:center; border-bottom:1px solid #000;">${selectedTable}</h3>`;
    currentOrder.forEach(it => {
        receiptHTML += `<div style="display:flex; justify-content:space-between;"><span>${it.name}</span><span>${it.price}€</span></div>`;
    });
    receiptHTML += `<h2 style="text-align:right; border-top:1px solid #000; margin-top:10px;">ΣΥΝΟΛΟ: ${document.getElementById('totalAmount').innerText}</h2></div>`;
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write('<html><body onload="window.print();window.close()">' + receiptHTML + '</body></html>');
    printWindow.document.close();
}

function clearCurrentScreen() { 
    let key = selectedTable.replace("Τραπέζι ", "");
    delete tableOrders[key]; // Διαγράφουμε την παραγγελία από τη μνήμη
    const btn = document.getElementById("btn-table-" + key);
    if (btn) { btn.style.backgroundColor = ""; btn.style.color = ""; } // Επαναφορά χρώματος
    currentOrder = []; 
    selectedTable = "Κανένα"; 
    updateOrderDisplay(); 
}

// Λοιπά κουμπιά
function startDelivery() { alert("Delivery Mode"); }
function showDailyTotal() { alert("Σύνολο: " + document.getElementById('totalAmount').innerText); }