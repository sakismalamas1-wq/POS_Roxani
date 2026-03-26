// ΒΑΣΙΚΕΣ ΜΕΤΑΒΛΗΤΕΣ
let currentOrder = [];
let selectedTable = "Κανένα";
let tableOrders = {}; 

// ΤΑ EXTRAS
const allExtras = [
    { name: "ΨΩΜΙ", price: 0 }, { name: "ΠΙΤΑ", price: 0 },
    { name: "ΑΠΟΛΑ", price: 0 }, { name: "ΠΑΤΑΤΕΣ", price: 0 },
    { name: "ΝΤΟΜΑΤΑ", price: 0 }, { name: "ΚΡΕΜΜΥΔΙ", price: 0 },
    { name: "ΜΟΥΣΤΑΡΔΑ", price: 0 }, { name: "ΚΕΤΣΑΠ", price: 0 },
    { name: "ΜΑΓΙΟΝΕΖΑ", price: 0 }, { name: "TZATZIKI", price: 0.30 },
    { name: "ΧΤΥΠΗΤΗ", price: 0.30 }
];

const menuData = {
    "ΨΩΜΙ ΠΙΤΑ": [{"name": "ψωμάκι", "price": "0.60"}, {"name": "πίτα", "price": "0.60"}],
    "ΣΑΝΤΟΥΙΤΣ": [{"name": "Σ. ΣΟΥΒΛΑΚΙ", "price": "3.50"}, {"name": "Σ. ΠΑΝΣΕΤΑ", "price": "3.80"}],
    "ΣΧΑΡΑΣ": [{"name": "Σουβλάκι τεμ.", "price": "1.80"}],
    "ΑΝΑΨΥΚΤΙΚΑ": [{"name": "ΚΟΚΑ ΚΟΛΑ", "price": "2.00"}, {"name": "ΝΕΡΟ 1L", "price": "1.20"}]
};

function initApp() {
    const tableContainer = document.getElementById('tableContainer');
    if (!tableContainer) return;
    tableContainer.innerHTML = ''; 

    const myTables = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45];
    myTables.forEach(num => {
        const tableBtn = document.createElement('button');
        tableBtn.innerText = num;
        tableBtn.id = "btn-table-" + num;
        tableBtn.className = 'btn-table';
        if (tableOrders[num]) tableBtn.style.backgroundColor = "yellow";

        tableBtn.onclick = () => { 
            selectedTable = "Τραπέζι " + num;
            currentOrder = tableOrders[num] || []; 
            updateOrderDisplay(); 
        };
        tableContainer.appendChild(tableBtn);
    });
    renderCategories();
}

function renderCategories() {
    const catDiv = document.getElementById('categories');
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
    prodDiv.innerHTML = '';
    menuData[category].forEach(item => {
        const btn = document.createElement('button');
        btn.innerText = item.name + "\n" + item.price + "€";
        btn.onclick = () => {
            if (selectedTable === "Κανένα") { alert("Διάλεξε τραπέζι!"); return; }
            let newItem = { ...item, note: "" };
            currentOrder.push(newItem);
            
            // Ανοίγει το modal
            if (category !== "ΑΝΑΨΥΚΤΙΚΑ") {
                openExtrasModal(newItem);
            }
            saveTableOrder();
            updateOrderDisplay();
        };
        prodDiv.appendChild(btn);
    });
}

function openExtrasModal(item) {
    const modal = document.getElementById('extrasModal');
    const container = document.getElementById('extrasContainer'); // ΕΔΩ ΗΤΑΝ ΤΟ ΛΑΘΟΣ, ΤΟ ΔΙΟΡΘΩΣΑ
    modal.style.display = "block";
    container.innerHTML = '';

    allExtras.forEach(ex => {
        const btn = document.createElement('button');
        btn.innerText = ex.name + (ex.price > 0 ? " +" + ex.price : "");
        btn.style = "padding:20px; background:#333; color:white; border:1px solid #555; border-radius:8px; font-weight:bold;";
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

function saveTableOrder() {
    let key = selectedTable.replace("Τραπέζι ", "");
    tableOrders[key] = currentOrder;
    const btn = document.getElementById("btn-table-" + key);
    if (btn) btn.style.backgroundColor = "yellow";
}

function updateOrderDisplay() {
    const list = document.getElementById('orderList');
    let total = 0;
    let html = `<h2 style="text-align:center; color:black;">${selectedTable}</h2>`;
    currentOrder.forEach(it => {
        total += parseFloat(it.price);
        html += `<div style="border-bottom:1px solid #ccc; padding:5px; color:black;">
                    <div style="display:flex; justify-content:space-between;"><b>${it.name}</b> <b>${it.price}€</b></div>
                    <small style="color:red;">${it.note}</small>
                 </div>`;
    });
    list.innerHTML = html;
    document.getElementById('totalAmount').innerText = total.toFixed(2) + "€";
}

function clearCurrentScreen() {
    let key = selectedTable.replace("Τραπέζι ", "");
    delete tableOrders[key];
    const btn = document.getElementById("btn-table-" + key);
    if (btn) btn.style.backgroundColor = "";
    currentOrder = [];
    selectedTable = "Κανένα";
    updateOrderDisplay();
}

// ΕΚΤΥΠΩΣΕΙΣ (ΜΟΝΟ ΑΠΟΔΕΙΞΗ)
function printFinalBill() {
    const content = document.getElementById('orderList').innerHTML;
    const total = document.getElementById('totalAmount').innerText;
    const win = window.open('', '', 'width=600,height=600');
    win.document.write(`<html><body style="font-family:monospace; width:80mm; color:black;" onload="window.print();window.close()">
        <h1 style="text-align:center;">ΡΩΞΑΝΗ</h1>${content}<h2 style="text-align:right;">ΣΥΝΟΛΟ: ${total}</h2></body></html>`);
}

function sendToKitchen() {
    const win = window.open('', '', 'width=600,height=600');
    let items = "";
    currentOrder.forEach(it => { items += `<li>${it.name} [${it.note}]</li>`; });
    win.document.write(`<html><body style="font-family:monospace; width:80mm; color:black;" onload="window.print();window.close()">
        <h1 style="text-align:center;">ΚΟΥΖΙΝΑ</h1><h3>${selectedTable}</h3><ul>${items}</ul></body></html>`);
}