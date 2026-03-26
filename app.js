let currentOrder = [];
let menuData = {};

function initApp() {
    console.log("Η εφαρμογή ξεκίνησε...");
    
    // 1. Σχεδίαση Τραπεζιών αμέσως (για να δούμε αν δουλεύει)
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = ''; // Καθαρισμός
        for (let i = 1; i <= 20; i++) {
            const tableBtn = document.createElement('button');
            tableBtn.innerText = "Τρ. " + i;
            tableBtn.className = 'btn-table';
            tableBtn.onclick = () => alert("Τραπέζι " + i);
            tableContainer.appendChild(tableBtn);
        }
    }

    // 2. Φόρτωση Μενού
    fetch('menu.json')
        .then(response => {
            if (!response.ok) throw new Error("Πρόβλημα με το menu.json");
            return response.json();
        })
        .then(data => {
            menuData = data;
            renderCategories();
        })
        .catch(err => {
            console.error("Σφάλμα:", err);
            document.getElementById('categories').innerHTML = "Σφάλμα φόρτωσης μενού.";
        });
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
    
    list.innerHTML = currentOrder.map(it => {
        total += parseFloat(it.price);
        return `<div style="padding:5px; border-bottom:1px solid #444;">${it.name} - ${it.price}€</div>`;
    }).join('');
    
    totalDisp.innerText = total.toFixed(2) + "€";
}

// Κενές συναρτήσεις για να μην "χτυπάει" το HTML αν πατήσεις κουμπί
function sendToKitchen() { alert("Αποστολή..."); }
function printFinalBill() { alert("Λογαριασμός..."); }
function clearCurrentScreen() { currentOrder = []; updateOrderDisplay(); }
function startDelivery() { alert("Delivery..."); }
function checkCustomer() {}
function showDailyTotal() { alert("Τζίρος: " + document.getElementById('totalAmount').innerText); }
function resetDailyTotal() { if(confirm("Μηδενισμός;")) alert("Μηδενίστηκε"); }