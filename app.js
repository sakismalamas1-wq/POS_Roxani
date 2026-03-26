// Αρχικοποίηση δεδομένων
let currentOrder = [];
let menuData = {};

// 1. Φόρτωση του Μενού από το menu.json
function initApp() {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            menuData = data;
            renderCategories();
        })
        .catch(err => console.error("Σφάλμα φόρτωσης μενού:", err));
		// --- ΚΩΔΙΚΑΣ ΓΙΑ ΤΡΑΠΕΖΙΑ ---
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
        for (let i = 1; i <= 0, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45; i++) {
            const tableBtn = document.createElement('button');
            tableBtn.innerText = "Τρ. " + i;
            tableBtn.className = 'btn-table';
            tableBtn.onclick = () => alert("Επιλέχθηκε το Τραπέζι " + i);
            tableContainer.appendChild(tableBtn);
        }
    }
}

// 2. Εμφάνιση Κατηγοριών (Κουμπιά)
function renderCategories() {
    const categoriesDiv = document.getElementById('categories');
    categoriesDiv.innerHTML = '';
    
    Object.keys(menuData).forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.onclick = () => renderProducts(cat);
        categoriesDiv.appendChild(btn);
    });
}

// 3. Εμφάνιση Προϊόντων όταν πατάς Κατηγορία
function renderProducts(category) {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = '';
    
    menuData[category].forEach(item => {
        const btn = document.createElement('button');
        btn.innerText = `${item.name}\n${item.price}€`;
        btn.onclick = () => addToOrder(item);
        productsDiv.appendChild(btn);
    });
}

// 4. Προσθήκη στην Παραγγελία
function addToOrder(item) {
    currentOrder.push(item);
    updateOrderDisplay();
}

// 5. Ενημέρωση της Λίστας και του Συνόλου
function updateOrderDisplay() {
    const list = document.getElementById('orderList');
    const totalDisp = document.getElementById('totalAmount');
    let total = 0;
    
    list.innerHTML = currentOrder.map((it, index) => {
        total += parseFloat(it.price);
        return `<div style="border-bottom:1px solid #ddd; padding:5px;">
                    ${it.name} - ${it.price}€ 
                </div>`;
    }).join('');
    
    totalDisp.innerText = total.toFixed(2) + "€";
}

// 6. Λειτουργία Ταμείου (Η "φλασιά" σου!)
function showDailyTotal() {
    // Προς το παρόν βγάζει ένα απλό μήνυμα, θα το συνδέσουμε με αρχείο μετά
    alert("Ο τζίρος σας μέχρι στιγμής είναι: " + document.getElementById('totalAmount').innerText);
}

// Βοηθητικές κενές συναρτήσεις για να μη βγάζει σφάλμα το HTML
function sendToKitchen() { alert("Αποστολή στην κουζίνα..."); }
function printFinalBill() { alert("Εκτύπωση Λογαριασμού..."); }
function clearCurrentScreen() { currentOrder = []; updateOrderDisplay(); }
function startDelivery() { alert("Έναρξη Delivery..."); }
function checkCustomer(val) { console.log("Αναζήτηση τηλεφώνου: " + val); }