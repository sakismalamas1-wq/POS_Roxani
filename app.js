var products = JSON.parse(localStorage.getItem('roxani_products')) || [];
var tableOrders = JSON.parse(localStorage.getItem('roxani_table_orders')) || {}; 
var customers = JSON.parse(localStorage.getItem('roxani_customers')) || {}; 

var currentOrder = []; 
var currentTable = null; 
var orderType = "ΕΠΙΛΕΞΤΕ ΤΡΑΠΕΖΙ";
var deliveryInfo = null;
var pendingItem = null;
var selectedExtras = [];

var fixedCategories = ["ΚΡΥΑ", "ΖΕΣΤΑ", "ΣΑΛΑΤΕΣ", "ΜΕΡΙΔΕΣ", "ΤΕΜΑΧΙΑ", "ΣΠΕΣΙΑΛ", "ΜΑΓΕΙΡΕΥΤΑ", "ΘΑΛΑΣΣΙΝΑ", "ΟΥΖΑ", "ΤΣΙΠΟΥΡΑ", "ΜΠΥΡΕΣ", "ΡΕΤΣΙΝΕΣ", "ΚΡΑΣΙΑ", "ΑΝΑΨΥΚΤΙΚΑ", "DELIVERY", "ΔΙΑΦΟΡΑ"];

function initApp() {
    renderTables();
    renderCategories();
    renderOrder();
}

function renderTables() {
    var el = document.getElementById('tableContainer');
    if(!el) return;
    
    // Τα κανονικά σου τραπέζια
    var allowedTables = [
        1, 2, 3, 4, 5, 6, 7, 8, 
        11, 12, 13, 14, 15, 
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 
        41, 42, 43, 44, 45
    ];

    var html = "";
    
    // 1. Εμφάνιση κανονικών τραπεζιών
    allowedTables.forEach(i => {
        var isOccupied = (tableOrders[i] && tableOrders[i].length > 0);
        var activeClass = isOccupied ? "table-active" : "";
        html += `<button class="btn-table ${activeClass}" onclick="setTable(${i})">
                    ${i}
                    ${isOccupied ? '<span style="color:#00FF00; position:absolute; top:2px; right:5px;">•</span>' : ''}
                 </button>`;
    });

    // 2. Προσθήκη κουμπιού TAKE AWAY στο τέλος
    var isTAOccupied = (tableOrders["TAKE-AWAY"] && tableOrders["TAKE-AWAY"].length > 0);
    var taActiveClass = isTAOccupied ? "table-active" : "";
    html += `<button class="btn-table ${taActiveClass}" 
                style="background: #6f42c1; font-size: 11px; width: 65px;" 
                onclick="setTakeAway()">
                TAKE AWAY
                ${isTAOccupied ? '<span style="color:#00FF00; position:absolute; top:2px; right:5px;">•</span>' : ''}
             </button>`;

    el.innerHTML = html;
}

// Νέα συνάρτηση ειδικά για το Take Away
function setTakeAway() {
    currentTable = "TAKE-AWAY";
    orderType = "ΠΑΡΑΓΓΕΛΙΑ TAKE AWAY";
    deliveryInfo = null;
    currentOrder = []; 
    renderOrder();
    renderTables();
}

function setTable(n) {
    currentTable = n;
    orderType = "ΤΡΑΠΕΖΙ " + n;
    deliveryInfo = null;
    currentOrder = []; 
    renderOrder();
    renderTables();
}

// --- ΔΙΑΧΕΙΡΙΣΗ ΠΡΟΪΟΝΤΩΝ & EXTRAS ---

function handleProductClick(name) {
    if(!currentTable) { alert("Επιλέξτε Τραπέζι ή Delivery!"); return; }
    const prod = products.find(p => p.name === name);
    if (!prod) return;

    // ΕΛΕΓΧΟΣ ΓΙΑ ΓΑΡΝΙΤΟΥΡΕΣ: Αν υπάρχουν extras, άνοιξε το παράθυρο
    if (prod.extras && prod.extras.length > 0 && prod.extras[0] !== "") {
        pendingItem = { name: prod.name, price: prod.price };
        selectedExtras = [];
        openExtraModal(prod);
    } else {
        currentOrder.push({ name: prod.name, price: prod.price });
        renderOrder();
    }
}

function openExtraModal(prod) {
    const modal = document.getElementById('extraModal');
    const container = document.getElementById('extraButtons');
    if(!modal || !container) return;

    modal.style.display = 'flex';
    document.getElementById('modalTitle').innerText = prod.name;
    
    let html = "";
    prod.extras.forEach((ex, i) => {
        html += `<button id="ex-${i}" style="background:#444; color:white; padding:15px; border:none; border-radius:5px; cursor:pointer;" onclick="toggleExtra('${ex}', 'ex-${i}')">${ex}</button>`;
    });
    html += `<button onclick="finishExtras()" style="grid-column:span 2; background:#00FF00; color:black; font-weight:bold; padding:15px; border:none; border-radius:5px; margin-top:10px; cursor:pointer;">ΠΡΟΣΘΗΚΗ</button>`;
    container.innerHTML = html;
}

function toggleExtra(ex, id) {
    const btn = document.getElementById(id);
    const idx = selectedExtras.indexOf(ex);
    if(idx > -1) { 
        selectedExtras.splice(idx, 1); 
        if(btn) btn.style.background = "#444"; 
    } else { 
        selectedExtras.push(ex); 
        if(btn) btn.style.background = "#007bff"; 
    }
}

function finishExtras() {
    const finalName = pendingItem.name + (selectedExtras.length ? " (" + selectedExtras.join(", ") + ")" : "");
    currentOrder.push({ name: finalName, price: pendingItem.price });
    renderOrder();
    closeModal();
}

function closeModal() {
    const m = document.getElementById('extraModal');
    if(m) m.style.display = 'none';
}

// --- ΛΟΙΠΕΣ ΛΕΙΤΟΥΡΓΙΕΣ (DELIVERY, ΕΚΤΥΠΩΣΗ) ---

function startDelivery() {
    const phone = document.getElementById('d_phone').value;
    const name = document.getElementById('d_name').value;
    const addr = document.getElementById('d_addr').value;
    const floor = document.getElementById('d_floor').value;
    const notes = document.getElementById('d_notes').value;

    if(!phone || !addr) { alert("Βάλτε Τηλέφωνο και Διεύθυνση!"); return; }
    
    customers[phone] = { name, addr, floor, notes };
    localStorage.setItem('roxani_customers', JSON.stringify(customers));
    
    deliveryInfo = { phone, name, addr, floor, notes };
    currentTable = "DEL-" + phone;
    orderType = `DEL: ${addr.toUpperCase()}`;
    
    currentOrder = [];
    renderOrder();
    renderTables();
}

function renderCategories() {
    const el = document.getElementById('categories');
    if (!el) return;
    let html = "";
    fixedCategories.forEach(c => {
        html += `<button onclick="showProds('${c}')">${c}</button>`;
    });
    el.innerHTML = html;
}

function showProds(c) {
    const el = document.getElementById('products');
    if (!el) return;
    const filtered = products.filter(p => p.cat === c);
    let html = "";
    filtered.forEach(p => {
        html += `<button onclick="handleProductClick('${p.name.replace(/'/g, "\\'")}')">${p.name}<br>${p.price.toFixed(2)}€</button>`;
    });
    el.innerHTML = html || "<div style='color:gray; padding:10px;'>Κενή κατηγορία</div>";
}

function renderOrder() {
    const el = document.getElementById('orderList');
    if (!el) return;
    let html = `<div style="text-align:center;"><b>${orderType}</b><hr>`;
    
    let saved = tableOrders[currentTable] || [];
    if(saved.length > 0) {
        html += `<div style="color:blue; font-size:11px; text-align:left;">ΕΚΤΥΠΩΜΕΝΑ:</div>`;
        saved.forEach(item => { 
            html += `<div style="display:flex; justify-content:space-between; color:#666; font-size:12px;"><span>${item.name}</span><span>${item.price.toFixed(2)}</span></div>`; 
        });
        html += `<hr>`;
    }
    
    currentOrder.forEach((item, index) => { 
        html += `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                    <span style="text-align:left; flex-grow:1;">${item.name}</span>
                    <span>${item.price.toFixed(2)} 
                    <button onclick="removeFromOrder(${index})" style="background:#dc3545; color:white; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:12px; margin-left:5px;">X</button>
                    </span>
                </div>`; 
    });
    
    let total = (saved.reduce((a, b) => a + b.price, 0) + currentOrder.reduce((a, b) => a + b.price, 0));
    html += `<hr><div style="text-align:right; font-size:18px; font-weight:bold;">ΣΥΝΟΛΟ: ${total.toFixed(2)}€</div></div>`;
    el.innerHTML = html;
}

function removeFromOrder(i) { currentOrder.splice(i, 1); renderOrder(); }

function sendToKitchen() {
    if(!currentTable || currentOrder.length === 0) return;
    let win = window.open('', '', 'height=400,width=300');
    win.document.write(`<html><body style="font-family:monospace; width:54mm; padding:2mm;"><h3>${orderType}</h3><hr>`);
    currentOrder.forEach(item => { win.document.write(`<div>- ${item.name}</div>`); });
    win.document.write(`<script>window.onload=function(){window.print();window.close();}<\/script></body></html>`);
    win.document.close();
    
    if(!tableOrders[currentTable]) tableOrders[currentTable] = [];
    tableOrders[currentTable] = tableOrders[currentTable].concat(currentOrder);
    localStorage.setItem('roxani_table_orders', JSON.stringify(tableOrders));
    currentOrder = []; renderOrder(); renderTables();
}

function printFinalBill() {
    let saved = tableOrders[currentTable] || [];
    let finalItems = saved.concat(currentOrder);
    if(finalItems.length === 0) return;
    
    let total = finalItems.reduce((a, b) => a + b.price, 0);
    let win = window.open('', '', 'height=600,width=400');
    win.document.write(`<html><body style="font-family:monospace; width:54mm; padding:2mm;"><h2>ΡΩΞΑΝΗ</h2>`);
    
    if(currentTable.toString().startsWith("DEL-") && deliveryInfo) {
        win.document.write(`<div style="font-size:13px; border:1px solid black; padding:5px; margin-bottom:10px;">`);
        win.document.write(`<b>ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ</b><br>`);
        win.document.write(`ΟΝ: ${deliveryInfo.name}<br>ΤΗΛ: ${deliveryInfo.phone}<br>ΔΙΕΥΘ: ${deliveryInfo.addr}<br>ΟΡ: ${deliveryInfo.floor}<br>ΣΧ: ${deliveryInfo.notes}</div>`);
    } else {
        win.document.write(`<h3 style="text-align:center;">ΤΡΑΠΕΖΙ ${currentTable}</h3><hr>`);
    }

    finalItems.forEach(item => { 
        win.document.write(`<div style="display:flex; justify-content:space-between;"><span>${item.name}</span><span>${item.price.toFixed(2)}</span></div>`); 
    });
    win.document.write(`<hr><b>ΣΥΝΟΛΟ: ${total.toFixed(2)}€</b><script>window.onload=function(){window.print();window.close();}<\/script></body></html>`);
    win.document.close();
    
    setTimeout(() => {
        if(confirm("ΚΛΕΙΣΙΜΟ ΠΑΡΑΓΓΕΛΙΑΣ;")) {
            delete tableOrders[currentTable];
            localStorage.setItem('roxani_table_orders', JSON.stringify(tableOrders));
            currentOrder = []; currentTable = null; orderType = "ΕΠΙΛΕΞΤΕ ΤΡΑΠΕΖΙ";
            renderOrder(); renderTables();
        }
    }, 500);
}

function searchCustomer(phone) {
    if (phone.length > 3 && customers[phone]) {
        let c = customers[phone];
        document.getElementById('d_name').value = c.name || "";
        document.getElementById('d_addr').value = c.addr || "";
        document.getElementById('d_floor').value = c.floor || "";
        document.getElementById('d_notes').value = c.notes || "";
    }
}

function clearCurrentScreen() {
    if(confirm("Ακύρωση νέων;")) { currentOrder = []; renderOrder(); }
}