// 1. Φόρτωση δεδομένων από τη μνήμη του browser
let products = JSON.parse(localStorage.getItem('roxani_products')) || [];
let currentOrder = [];
let selectedExtras = [];
let pendingItem = null;

// 2. Η πρώτη λειτουργία που τρέχει μόλις ανοίξει η σελίδα
function initApp() {
    renderCategories();
}

// 3. Εμφάνιση των Κατηγοριών (Πρέπει να είναι ίδιες με το Admin)
function renderCategories() {
    const container = document.getElementById('categories');
    if(!container) return;
    
    // Εδώ βάλε τις κατηγορίες που έγραψες στο Admin
    const cats = ["ΚΡΥΑ", "ΖΕΣΤΑ", "ΣΑΛΑΤΕΣ", "ΣΧΑΡΑΣ", "ΤΕΜΑΧΙΑ", "ΜΑΓΕΙΡΕΥΤΑ", "ΘΑΛΑΣΣΙΝΑ", "ΠΟΤΑ", "ΑΝΑΨΥΚΤΙΚΑ"];
    
    let html = "";
    cats.forEach(c => {
        html += `<button onclick="showProducts('${c}')">${c}</button>`;
    });
    container.innerHTML = html;
}

// 4. Εμφάνιση Προϊόντων ανά κατηγορία
function showProducts(cat) {
    const container = document.getElementById('products');
    if(!container) return;
    
    const filtered = products.filter(p => p.category === cat);
    let html = "";
    
    filtered.forEach(p => {
        const data = JSON.stringify(p).replace(/"/g, '&quot;');
        html += `<button onclick="handleProductClick('${data}')">${p.name}<br>${p.price.toFixed(2)}€</button>`;
    });
    container.innerHTML = html;
}

// 5. Όταν πατάμε ένα προϊόν
function handleProductClick(pString) {
    const prod = JSON.parse(pString.replace(/&quot;/g, '"'));
    if (prod.extras && prod.extras.length > 0) {
        pendingItem = prod;
        selectedExtras = [];
        openExtraModal(prod);
    } else {
        addToOrder(prod.name, prod.price);
    }
}

// 6. Πρόσθεσε στην παραγγελία
function addToOrder(name, price) {
    currentOrder.push({ name, price });
    renderOrder();
}

// 7. Εμφάνιση της λίστας παραγγελίας στην οθόνη
function renderOrder() {
    const list = document.getElementById('orderList');
    if(!list) return;
    let total = 0;
    let html = "";
    currentOrder.forEach(item => {
        html += `<div style="display:flex; justify-content:space-between; margin-bottom:5px; border-bottom:1px dotted #555;">
                    <span>${item.name}</span>
                    <span>${item.price.toFixed(2)}€</span>
                 </div>`;
        total += item.price;
    });
    html += `<div style="text-align:right; margin-top:10px; font-size:18px; color:#00FF00;"><strong>ΣΥΝΟΛΟ: ${total.toFixed(2)}€</strong></div>`;
    list.innerHTML = html;
}

// Λειτουργίες για τα Extras (Modal)
function openExtraModal(prod) {
    document.getElementById('extraModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = prod.name;
    const container = document.getElementById('extraButtons');
    let html = "";
    prod.extras.forEach((ex, i) => {
        let label = ex.includes('|') ? ex.split('|')[0] + " (+" + ex.split('|')[1] + "€)" : ex;
        html += `<button id="ex-${i}" style="background:#444; color:white; padding:15px;" onclick="toggleExtra('${ex}', 'ex-${i}')">${label}</button>`;
    });
    html += `<button onclick="finishExtras()" style="grid-column:span 2; background:#00FF00; color:black; font-weight:bold; padding:15px; margin-top:10px;">ΠΡΟΣΘΗΚΗ</button>`;
    container.innerHTML = html;
}

function toggleExtra(ex, id) {
    const btn = document.getElementById(id);
    const idx = selectedExtras.indexOf(ex);
    if(idx > -1) {
        selectedExtras.splice(idx, 1);
        btn.style.background = "#444";
    } else {
        selectedExtras.push(ex);
        btn.style.background = "#007bff";
    }
}

function finishExtras() {
    let extraTotal = 0;
    let names = [];
    selectedExtras.forEach(ex => {
        let parts = ex.split('|');
        names.push(parts[0]);
        if(parts[1]) extraTotal += parseFloat(parts[1]);
    });
    const finalName = pendingItem.name + (names.length ? " (" + names.join(",") + ")" : "");
    addToOrder(finalName, pendingItem.price + extraTotal);
    closeModal();
}

function closeModal() { document.getElementById('extraModal').style.display = 'none'; }
function clearCurrentScreen() { currentOrder = []; renderOrder(); }
