// ΑΡΧΙΚΟΠΟΙΗΣΗ ΔΕΔΟΜΕΝΩΝ
var products = JSON.parse(localStorage.getItem('roxani_products')) || [];
var tableOrders = JSON.parse(localStorage.getItem('roxani_table_orders')) || {}; 
var currentOrder = []; 
var currentTable = null; 
var pendingItem = null;
var selectedExtras = [];

// ΕΚΚΙΝΗΣΗ
function initApp() {
    renderTables();
    renderCategories();
}

// ΕΜΦΑΝΙΣΗ ΤΡΑΠΕΖΙΩΝ
function renderTables() {
    const container = document.getElementById('tableContainer');
    if(!container) return;
    const allowedTables = [1,2,3,4,5,6,7,8,11,12,13,14,15,21,22,23,24,25,26,27,28,29,30,31,41,42,43,44,45];
    let html = "";
    allowedTables.forEach(i => {
        const isOccupied = (tableOrders[i] && tableOrders[i].length > 0);
        html += `<button class="btn-table ${isOccupied ? 'table-active' : ''}" onclick="setTable(${i})">${i}</button>`;
    });
    container.innerHTML = html;
}

function setTable(n) {
    currentTable = n;
    alert("ΕΠΙΛΕΧΘΗΚΕ ΤΡΑΠΕΖΙ: " + n);
    // Αν το τραπέζι έχει ήδη παραγγελία, μπορούμε να την φορτώσουμε εδώ
}

// ΕΜΦΑΝΙΣΗ ΚΑΤΗΓΟΡΙΩΝ
function renderCategories() {
    const container = document.getElementById('categories');
    if(!container) return;
    const cats = ["ΚΡΥΑ", "ΖΕΣΤΑ", "ΣΑΛΑΤΕΣ", "ΣΧΑΡΑΣ", "ΤΕΜΑΧΙΑ", "ΜΑΓΕΙΡΕΥΤΑ", "ΘΑΛΑΣΣΙΝΑ", "ΠΟΤΑ", "ΑΝΑΨΥΚΤΙΚΑ"];
    let html = "";
    cats.forEach(c => {
        html += `<button onclick="showProducts('${c}')">${c}</button>`;
    });
    container.innerHTML = html;
}

// ΕΜΦΑΝΙΣΗ ΠΡΟΪΟΝΤΩΝ
function showProducts(cat) {
    const container = document.getElementById('products');
    let html = "";
    const filtered = products.filter(p => p.category === cat);
    
    filtered.forEach(p => {
        html += `<button onclick='handleProductClick(${JSON.stringify(p)})'>${p.name}<br>${p.price.toFixed(2)}€</button>`;
    });
    container.innerHTML = html;
}

// ΟΤΑΝ ΠΑΤΑΜΕ ΕΝΑ ΠΡΟΪΟΝ
function handleProductClick(prod) {
    if (prod.extras && prod.extras.length > 0) {
        pendingItem = prod;
        selectedExtras = [];
        openExtraModal(prod);
    } else {
        addToOrder(prod.name, prod.price);
    }
}

function openExtraModal(prod) {
    document.getElementById('extraModal').style.display = 'flex';
    document.getElementById('modalTitle').innerText = prod.name;
    const container = document.getElementById('extraButtons');
    let html = "";
    prod.extras.forEach((ex, i) => {
        html += `<button id="ex-${i}" style="background:#444; color:white; padding:15px;" onclick="toggleExtra('${ex}', 'ex-${i}')">${ex}</button>`;
    });
    html += `<button onclick="finishExtras()" style="grid-column:span 2; background:#00FF00; color:black; padding:15px;">ΠΡΟΣΘΗΚΗ</button>`;
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
    let extraPrice = 0;
    let names = [];
    selectedExtras.forEach(ex => {
        let parts = ex.split('|');
        names.push(parts[0]);
        if(parts[1]) extraPrice += parseFloat(parts[1]);
    });
    
    const name = pendingItem.name + (names.length ? " (" + names.join(",") + ")" : "");
    addToOrder(name, pendingItem.price + extraPrice);
    closeModal();
}

function addToOrder(name, price) {
    currentOrder.push({ name, price });
    renderOrder();
}

function renderOrder() {
    const list = document.getElementById('orderList');
    let total = 0;
    let html = "";
    currentOrder.forEach((item, idx) => {
        html += `<div>${item.name} - ${item.price.toFixed(2)}€</div>`;
        total += item.price;
    });
    html += `<hr><strong>ΣΥΝΟΛΟ: ${total.toFixed(2)}€</strong>`;
    list.innerHTML = html;
}

function closeModal() { document.getElementById('extraModal').style.display = 'none'; }
function clearCurrentScreen() { currentOrder = []; renderOrder(); }
