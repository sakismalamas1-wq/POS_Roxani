// ==========================================
// ΜΕΤΑΒΛΗΤΕΣ ΚΑΙ ΔΕΔΟΜΕΝΑ
// ==========================================
let currentOrder = [];
let selectedTable = "Κανένα";
let tableOrders = {}; 

// Φόρτωση από το Admin (localStorage)
let menuData = JSON.parse(localStorage.getItem('menuData')) || {};

// Σταθερά Extras (όπως στη φωτό σου)
const allExtras = [
    { name: "ΨΩΜΙ", price: 0 }, { name: "ΠΙΤΑ", price: 0 }, { name: "ΑΠΟΛΑ", price: 0 },
    { name: "ΠΑΤΑΤΕΣ", price: 0 }, { name: "ΝΤΟΜΑΤΑ", price: 0 }, { name: "ΚΡΕΜΜΥΔΙ", price: 0 },
    { name: "ΜΟΥΣΤΑΡΔΑ", price: 0 }, { name: "ΚΕΤΣΑΠ", price: 0 }, { name: "ΜΑΓΙΟΝΕΖΑ", price: 0 },
    { name: "TZATZIKI", price: 0.30 }, { name: "ΧΤΥΠΗΤΗ", price: 0.30 }
];

// ==========================================
// ΕΝΑΡΞΗ ΕΦΑΡΜΟΓΗΣ
// ==========================================
function initApp() {
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = '';
        const myTables = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45];
        myTables.forEach(num => {
            const btn = document.createElement('button');
            btn.innerText = num;
            btn.id = "btn-table-" + num;
            btn.className = 'btn-table';
            btn.onclick = () => selectMyTable(num);
            tableContainer.appendChild(btn);
        });
    }
    renderCategories();
}

// ==========================================
// ΔΙΑΧΕΙΡΙΣΗ ΤΡΑΠΕΖΙΩΝ & DELIVERY
// ==========================================
function selectMyTable(num) {
    selectedTable = "Τραπέζι " + num;
    currentOrder = tableOrders[num] || [];
    updateOrderDisplay();
}

function startDelivery() {
    const tel = document.getElementById('cust_tel')?.value || "";
    const name = document.getElementById('cust_name')?.value || "Πελάτης";
    if (!tel) { alert("Βάλτε τηλέφωνο!"); return; }
    selectedTable = "DELIVERY: " + name + " (" + tel + ")";
    currentOrder = []; // Ξεκινάει νέα παραγγελία για το delivery
    updateOrderDisplay();
}

// ==========================================
// ΜΕΝΟΥ ΚΑΙ ΠΡΟΪΟΝΤΑ
// ==========================================
function renderCategories() {
    const catDiv = document.getElementById('categories');
    if (!catDiv) return;
    catDiv.innerHTML = '';
    Object.keys(menuData).forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.onclick = () => renderProducts(cat);
        catDiv.appendChild(btn);
    });
}

function renderProducts(category) {
    const prodDiv = document.getElementById('products');
    if (!prodDiv) return;
    prodDiv.innerHTML = '';
    menuData[category].forEach(item => {
        const btn = document.createElement('button');
        btn.innerText = item.name + "\n" + item.price + "€";
        btn.onclick = () => {
            if (selectedTable === "Κανένα") { alert("Διαλέξτε Τραπέζι ή Delivery!"); return; }
            let newItem = { ...item, note: "", uniqueId: Date.now() };
            currentOrder.push(newItem);
            if (category !== "ΑΝΑΨΥΚΤΙΚΑ") openExtrasModal(newItem);
            saveToTable();
            updateOrderDisplay();
        };
        prodDiv.appendChild(btn);
    });
}

// ==========================================
// EXTRAS (MODAL)
// ==========================================
function openExtrasModal(item) {
    const modal = document.getElementById('extrasModal');
    // Ελέγχουμε και τα δύο πιθανά ονόματα για να μην κολλήσει
    const container = document.getElementById('extrasContainer') || document.getElementById('extrasButtons');
    if (!modal || !container) return;

    modal.style.display = "block";
    container.innerHTML = '';
    allExtras.forEach(ex => {
        const btn = document.createElement('button');
        btn.innerText = ex.name + (ex.price > 0 ? " +" + ex.price : "");
        btn.className = 'btn-modal-extra';
        btn.style = "padding:15px; background:#333; color:white; border:1px solid #555; border-radius:8px; font-weight:bold; cursor:pointer;";
        btn.onclick = () => {
            item.note += (item.note ? ", " : "") + ex.name;
            item.price = (parseFloat(item.price) + ex.price).toFixed(2);
            btn.style.backgroundColor = "#27ae60";
            updateOrderDisplay();
        };
        container.appendChild(btn);
    });
}

function closeExtras() {
    const modal = document.getElementById('extrasModal');
    if (modal) modal.style.display = "none";
}

// ==========================================
// ΕΝΗΜΕΡΩΣΗ ΟΘΟΝΗΣ & ΕΚΤΥΠΩΣΕΙΣ
// ==========================================
function updateOrderDisplay() {
    const list = document.getElementById('orderList');
    if (!list) return;
    let total = 0;
    let html = `<h2 style="text-align:center; color:black; font-weight:900;">${selectedTable}</h2>`;
    
    currentOrder.forEach(it => {
        total += parseFloat(it.price);
        html += `<div style="border-bottom:2px solid #333; padding:10px; color:black; font-weight:900; font-size:18px;">
                    <div style="display:flex; justify-content:space-between;"><span>${it.name}</span> <span>${it.price}€</span></div>
                    <div style="color:red; font-size:15px; font-style:italic;">${it.note}</div>
                 </div>`;
    });
    
    list.innerHTML = html;
    const totalEl = document.getElementById('totalAmount');
    if (totalEl) totalEl.innerText = total.toFixed(2) + "€";
}

function saveToTable() {
    if (selectedTable.includes("Τραπέζι")) {
        let key = selectedTable.replace("Τραπέζι ", "");
        tableOrders[key] = currentOrder;
        const btn = document.getElementById("btn-table-" + key);
        if (btn) btn.style.backgroundColor = "yellow";
    }
}

// Λοιπά κουμπιά για να μην βγάζει σφάλμα
function clearCurrentScreen() {
    let key = selectedTable.replace("Τραπέζι ", "");
    const btn = document.getElementById("btn-table-" + key);
    if (btn) btn.style.backgroundColor = "";
    delete tableOrders[key];
    currentOrder = [];
    selectedTable = "Κανένα";
    updateOrderDisplay();
}

function sendToKitchen() { window.print(); }
function printFinalBill() { window.print(); }
function showDailyTotal() { alert("Σύνολο: " + document.getElementById('totalAmount').innerText); }
function resetDailyTotal() { if(confirm("Μηδενισμός ταμείου;")) location.reload(); }
function checkCustomer() {}