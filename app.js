let products = JSON.parse(localStorage.getItem('roxani_products')) || [];
let allTablesData = JSON.parse(localStorage.getItem('roxani_tables')) || {}; 
let customers = JSON.parse(localStorage.getItem('roxani_customers')) || {};
let currentOrder = [];
let selectedTable = "TAKE AWAY";
let selectedExtras = [];

function initApp() { 
    renderTables(); 
    renderCategories(); 
    
    // ΠΡΟΣΘΗΚΗ: Ακροατής για αυτόματη συμπλήρωση πελάτη
    const telInput = document.getElementById('cust_tel');
    if(telInput) {
        telInput.addEventListener('input', function(e) {
            let tel = e.target.value;
            if(customers[tel]) {
                document.getElementById('cust_name').value = customers[tel].name || "";
                document.getElementById('cust_addr').value = customers[tel].addr || "";
                document.getElementById('cust_floor').value = customers[tel].floor || "";
            }
        });
    }
}

// 1. ΛΕΙΤΟΥΡΓΙΑ EXTRAS
function openExtras(idx) {
    const p = products[idx];
    selectedExtras = []; 

    const modal = document.getElementById('extrasModal');
    const container = document.getElementById('extrasContainer');
    const title = document.getElementById('modalTitle');
    
    if(!modal || !container) return;

    if(!p.extras || p.extras.length === 0) {
        addItemToOrder(p.name, p.price);
        return;
    }

    title.innerText = p.name;
    container.innerHTML = ""; 

    p.extras.forEach((ex) => {
        const btn = document.createElement('button');
        btn.innerText = ex;
        btn.style.cssText = "padding:20px; background:#444; color:white; border:1px solid #666; border-radius:8px; font-size:18px; font-weight:bold; cursor:pointer;";
        
        btn.onclick = function() {
            if(selectedExtras.includes(ex)) {
                selectedExtras = selectedExtras.filter(item => item !== ex);
                btn.style.background = "#444";
                btn.style.border = "1px solid #666";
            } else {
                selectedExtras.push(ex);
                btn.style.background = "#007bff"; 
                btn.style.border = "2px solid white";
            }
        };
        container.appendChild(btn);
    });

    const okBtn = document.createElement('button');
    okBtn.innerText = "ΟΚ / ΠΡΟΣΘΗΚΗ";
    okBtn.style.cssText = "padding:20px; background:#28a745; color:white; border:none; border-radius:8px; font-size:22px; font-weight:bold; cursor:pointer; grid-column: span 2; margin-top:10px;";
    
    okBtn.onclick = function() {
        modal.style.display = "none";

        let finalName = p.name;
        let finalPrice = p.price;
        let namesOnly = [];

        if(selectedExtras.length > 0) {
            selectedExtras.forEach(ex => {
                if(ex.includes('+')) {
                    let parts = ex.split('+');
                    namesOnly.push(parts[0].trim());
                    let pVal = parts[1].replace(',', '.');
                    finalPrice += parseFloat(pVal) || 0;
                } else {
                    namesOnly.push(ex);
                }
            });
            finalName += " (" + namesOnly.join(", ") + ")";
        }
        
        addItemToOrder(finalName, finalPrice);
        selectedExtras = [];
    };
    container.appendChild(okBtn);

    modal.style.display = "block";
}

function closeExtras() {
    document.getElementById('extrasModal').style.display = "none";
    selectedExtras = [];
}

function addItemToOrder(name, price) {
    currentOrder.push({ n: name, p: price });
    allTablesData[selectedTable] = [...currentOrder];
    localStorage.setItem('roxani_tables', JSON.stringify(allTablesData));
    renderOrder();
}

function renderOrder() {
    const list = document.getElementById('orderList');
    let tot = 0;
    if(!list) return;
    list.innerHTML = currentOrder.map((it, i) => {
        tot += it.p;
        return '<div style="display:flex; justify-content:space-between; color:black; border-bottom:1px solid #ddd; padding:8px; font-size:18px;">' +
               '<span onclick="currentOrder.splice(' + i + ',1); renderOrder();" style="cursor:pointer">❌ ' + it.n + '</span>' +
               '<b>' + it.p.toFixed(2) + '€</b></div>';
    }).join('');
    document.getElementById('totalAmount').innerText = tot.toFixed(2) + "€";
}

// 2. DELIVERY & ΤΡΑΠΕΖΙΑ (ΜΕ ΜΝΗΜΗ ΠΕΛΑΤΩΝ)
function startDelivery() {
    let tel = document.getElementById('cust_tel').value;
    let name = document.getElementById('cust_name').value;
    let addr = document.getElementById('cust_addr').value;
    let floor = document.getElementById('cust_floor').value;
    
    if(!tel) return alert("Βάλε τηλέφωνο!");
    
    selectedTable = "DELIVERY: " + name + " (" + tel + ") - " + addr + " " + floor;
    
    // Αποθήκευση/Ενημέρωση πελάτη στη μνήμη
    customers[tel] = { name, addr, floor };
    localStorage.setItem('roxani_customers', JSON.stringify(customers));
    
    alert("Delivery OK!");
}

function sendToKitchen() {
    if(currentOrder.length === 0) return alert("Κενή παραγγελία!");
    const win = window.open('', '', 'width=600,height=800');
    win.document.write('<html><body style="font-family:Arial; font-size:24px; font-weight:bold; width:80mm; margin:0; padding:10px; min-height:450px;" onload="window.print(); window.close();">');
    win.document.write('<center><h1 style="font-size:40px; margin:0;">ΚΟΥΖΙΝΑ</h1><h2 style="font-size:30px; margin:5px 0;">' + selectedTable + '</h2><hr style="border:2px solid black;"></center>');
    win.document.write('<div style="margin-top:20px;">');
    currentOrder.forEach(it => { 
        win.document.write('<div style="margin-bottom:20px; border-bottom:1px dashed #444; padding-bottom:10px;">• ' + it.n + '</div>'); 
    });
    win.document.write('</div>');
    win.document.write('<div style="height:120px;"></div>');
    win.document.write('<center><div style="font-size:18px;">' + new Date().toLocaleTimeString() + '</div></center>');
    win.document.write('</body></html>');
    win.document.close();
}

function printFinalBill() {
    if(currentOrder.length === 0) return alert("Κενή παραγγελία!");
    
    let tot = 0;
    currentOrder.forEach(it => { tot += it.p; });

    let dailySales = JSON.parse(localStorage.getItem('roxani_daily_sales')) || 0;
    dailySales += tot;
    localStorage.setItem('roxani_daily_sales', JSON.stringify(dailySales));

    const win = window.open('', '', 'width=600,height=800');
    win.document.write('<html><body style="font-family:Arial; font-size:22px; font-weight:bold; width:80mm; margin:0; padding:15px; line-height:1.8;" onload="window.print(); window.close();">');
    win.document.write('<center><h1 style="font-size:35px; margin:10px 0;">ΡΩΞΑΝΗ</h1><h2 style="font-size:26px; margin:10px 0;">' + selectedTable + '</h2><hr style="border:2px solid black;"></center>');
    win.document.write('<div style="margin-top:25px;">');
    currentOrder.forEach(it => {
        win.document.write('<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee;">' +
                           '<span style="max-width:75%;">' + it.n + '</span>' + 
                           '<span>' + it.p.toFixed(2) + '€</span></div>');
    });
    win.document.write('</div>');
    win.document.write('<div style="margin-top:30px; border-top:3px solid black; padding-top:10px; text-align:right; font-size:32px;">ΣΥΝΟΛΟ: ' + tot.toFixed(2) + '€</div>');
    win.document.write('<div style="height:150px;"></div>'); 
    win.document.write('<center><div style="font-size:16px;">Ευχαριστούμε!</div><div style="font-size:14px;">' + new Date().toLocaleString('el-GR') + '</div></center>');
    win.document.write('</body></html>');
    win.document.close();
    
    currentOrder = []; renderOrder();
}

function renderTables() {
    const container = document.getElementById('tableContainer');
    const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45];
    if(!container) return;
    
    container.innerHTML = nums.map(i => {
        let n = (i === 0) ? "TAKE AWAY" : i;
        let tName = (i === 0) ? "TAKE AWAY" : "ΤΡΑΠΕΖΙ " + i;
        let style = "";
        if (allTablesData[tName] && allTablesData[tName].length > 0) {
            style = 'style="background:#ffc107; color:black; border:2px solid #000;"';
        }
        let activeClass = (selectedTable === tName) ? "table-active" : "";
        return `<button class="btn-table ${activeClass}" id="t-${i}" ${style} onclick="setTable(${i})">${n}</button>`;
    }).join('');
}

function setTable(i) {
    if (selectedTable) {
        allTablesData[selectedTable] = [...currentOrder];
    }
    selectedTable = (i === 0) ? "TAKE AWAY" : "ΤΡΑΠΕΖΙ " + i;
    currentOrder = allTablesData[selectedTable] || [];
    
    document.querySelectorAll('.btn-table').forEach(b => b.classList.remove('table-active'));
    let el = document.getElementById('t-' + i);
    if(el) el.classList.add('table-active');

    localStorage.setItem('roxani_tables', JSON.stringify(allTablesData));
    renderOrder();
    renderTables();
}

function renderCategories() {
    const cats = ["ΨΩΜΙ ΠΙΤΑ", "ΚΡΥΑ", "ΖΕΣΤΑ", "ΣΑΛΑΤΕΣ", "ΣΧΑΡΑΣ", "ΤΕΜΑΧΙΑ", "ΣΠΕΣΙΑΛ", "ΜΑΓΕΙΡΕΥΤΑ", "ΘΑΛΑΣΣΙΝΑ", "ΣΑΝΤΟΥΙΤΣ", "ΟΥΖΑ ΤΣΙΠΟΥΡΑ", "ΜΠΥΡΕΣ", "ΚΡΑΣΙΑ ΡΕΤΣΙΝΕΣ", "ΑΝΑΨΥΚΤΙΚΑ", "DELIVERY", "ΔΙΑΦΟΡΑ"];
    const container = document.getElementById('categories');
    if(!container) return;
    container.innerHTML = cats.map(c => '<button onclick="showProducts(\'' + c + '\')">' + c + '</button>').join('');
}

function showProducts(cat) {
    const container = document.getElementById('products');
    const filtered = products.filter(p => (p.category || p.Κατηγορία) === cat);
    if(!container) return;
    container.innerHTML = filtered.map(p => {
        let idx = products.indexOf(p);
        return '<button style="height:80px; font-weight:bold;" onclick="openExtras(' + idx + ')">' + p.name + '<br>' + p.price.toFixed(2) + '€</button>';
    }).join('');
}

function showDailyTotal() {
    let daily = JSON.parse(localStorage.getItem('roxani_daily_sales')) || 0;
    alert("ΤΥΠΟΣ: ΤΑΜΕΙΟ ΗΜΕΡΑΣ\n--------------------------\nΣΥΝΟΛΙΚΕΣ ΕΙΣΠΡΑΞΕΙΣ: " + daily.toFixed(2) + "€\n\n(Για να μηδενίσεις το ταμείο για αύριο, πάτα 'ΚΑΘΑΡΙΣΜΟΣ ΤΑΜΕΙΟΥ')");
}

function resetDailyTotal() {
    if(confirm("ΘΕΛΕΙΣ ΝΑ ΜΗΔΕΝΙΣΕΙΣ ΤΟ ΤΑΜΕΙΟ ΓΙΑ ΤΗ ΝΕΑ ΜΕΡΑ;")) {
        localStorage.setItem('roxani_daily_sales', JSON.stringify(0));
        alert("Το ταμείο μηδενίστηκε!");
    }
}

function clearCurrentScreen() {
    if(confirm("ΑΚΥΡΩΣΗ;")) { currentOrder = []; renderOrder(); }
}

initApp();
