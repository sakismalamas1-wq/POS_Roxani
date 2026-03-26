let currentOrder = [];
myTables.forEach(num => {
            const tableBtn = document.createElement('button');
            tableBtn.innerText = num;
            tableBtn.id = "btn-table-" + num; // Δίνουμε ένα ID στο κάθε κουμπί
            tableBtn.className = 'btn-table';
            
            // Αν το τραπέζι έχει ήδη παραγγελία, το κάνουμε κίτρινο
            if (tableOrders[num] && tableOrders[num].length > 0) {
                tableBtn.style.backgroundColor = "yellow";
                tableBtn.style.color = "black";
            }

            tableBtn.onclick = () => { 
                selectedTable = "Τραπέζι " + num;
                // Φορτώνουμε την παραγγελία αυτού του τραπεζιού αν υπάρχει
                currentOrder = tableOrders[num] || []; 
                updateOrderDisplay(); 
            };
            tableContainer.appendChild(tableBtn);
        });

// ΕΔΩ ΕΙΝΑΙ ΤΟ ΜΕΝΟΥ ΣΟΥ - Μπορείς να προσθέτεις/αλλάζεις προϊόντα εδώ
const menuData = {
    "ΨΩΜΙ ΠΙΤΑ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
    "ΚΡΥΑ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
    "ΖΕΣΤΑ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
    "ΣΑΛΑΤΕΣ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
    "ΣΧΑΡΑΣ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
    "ΣΠΕΣΙΑΛ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
     "ΜΑΓΕΙΡΕΥΤΑ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
    "ΘΑΛΑΣΣΙΝΑ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
    "ΤΕΜΑΧΙΑ": [
        {"name": "Φραπέ", "price": "2.00"},
        {"name": "Φρεντο Εσπρέσσο", "price": "2.50"},
        {"name": "Ελληνικός", "price": "1.50"}
    ],
    "ΣΑΝΤΟΥΙΤΣ": [
        {"name": "Ελληνικός", "price": "1.50"},
        {"name": "Νεσκαφέ", "price": "2.00"}
    ],
    "ΟΥΖΑ ΤΣΙΠΟΥΡΑ": [
        {"name": "Coca Cola 330ml", "price": "2.00"},
        {"name": "Πορτοκαλάδα", "price": "2.00"}
    ],
     "ΜΠΥΡΕΣ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
     "ΡΕΤΣΙΝΕΣ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
     "ΚΡΑΣΙΑ": [
        {"name": "ψωμάκι", "price": "0.60"},
        {"name": "πίτα", "price": "0.60"},
        {"name": "2 άρτος", "price": "1.20"},
        {"name": "μερίδα ψωμί", "price": "1.20"}
    ],
     "ΑΝΑΨΥΚΤΙΚΑ": [
        {"name": "ΚΟΚΑ ΚΟΛΑ", "price": "2.00"},
        {"name": "ΠΟΡΤΟΚΑΛΑΔΑ", "price": "2.00"},
        {"name": "ΛΕΜΟΝΑΔΑ", "price": "2.00"},
        {"name": "ΓΚΑΖΟΖΑ", "price": "2.00"},
        {"name": "ΣΟΔΑ", "price": "2.00"},
        {"name": "ZERO", "price": "2.00"},
        {"name": "ΧΥΜΟΣ", "price": "3.00"},
        {"name": "ΝΕΡΟ 1L", "price": "1.20"}
    ], 
    "DELIVERY": [
        {"name": "κόστος delivery", "price": "1.0"},
        {"name": "κόστος delivery", "price": "2.00"}
    ]
};

function initApp() {
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = ''; 

        // 1. Κουμπί TAKE AWAY (Πορτοκαλί)
        const takeawayBtn = document.createElement('button');
        takeawayBtn.innerText = "TAKE AWAY";
        takeawayBtn.className = 'btn-table';
        takeawayBtn.style.backgroundColor = "#e67e22";
        // Όταν το πατάς, απλά αποθηκεύει την επιλογή, ΔΕΝ βγάζει ταμπελάκι
        takeawayBtn.onclick = () => { 
            selectedTable = "TAKE AWAY"; 
            updateOrderDisplay(); 
        };
        tableContainer.appendChild(takeawayBtn);

        // 2. Τραπέζια
        const myTables = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 41, 42, 43, 44, 45];
        myTables.forEach(num => {
            const tableBtn = document.createElement('button');
            tableBtn.innerText = num;
            tableBtn.className = 'btn-table';
            // Όταν το πατάς, αλλάζει ο τίτλος στην απόδειξη
            tableBtn.onclick = () => { 
                selectedTable = "Τραπέζι " + num; 
                updateOrderDisplay(); 
            };
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

function renderExtras() {
    const extrasDiv = document.getElementById('extrasContainer'); // Πρέπει να υπάρχει στο HTML σου
    if (!extrasDiv) return;
    extrasDiv.innerHTML = '<h4 style="color:white; margin:5px;">EXTRAS:</h4>';

    commonExtras.forEach(extra => {
        const btn = document.createElement('button');
        btn.innerText = extra.name + (extra.price > 0 ? " +" + extra.price : "");
        btn.className = 'btn-extra'; // Φτιάξε μια κλάση στο CSS για μικρά κίτρινα κουμπιά
        btn.onclick = () => {
            if (currentOrder.length > 0) {
                // Προσθέτει το extra στο ΤΕΛΕΥΤΑΙΟ προϊόν που χτύπησες
                let lastItem = currentOrder[currentOrder.length - 1];
                lastItem.name += " (" + extra.name + ")";
                lastItem.price = (parseFloat(lastItem.price) + parseFloat(extra.price)).toFixed(2);
                updateOrderDisplay();
            }
        };
        extrasDiv.appendChild(btn);
    });
}

function updateOrderDisplay() {
    const list = document.getElementById('orderList');
    const totalDisp = document.getElementById('totalAmount');
    let total = 0;
    
    if (list) {
        // Τίτλος Τραπεζιού σε ΜΑΥΡΟ χρώμα
        let html = `<h2 style="color:black; text-align:center; border-bottom:2px solid #e67e22; padding-bottom:10px;">${selectedTable}</h2>`;
        
        currentOrder.forEach((it) => {
            total += parseFloat(it.price);
            // Προϊόντα με ΜΑΥΡΑ γράμματα για να φαίνονται στο λευκό φόντο
            html += `<div style="padding:10px; border-bottom:1px solid #ccc; color:black; display:flex; justify-content:space-between; font-size:18px; font-weight:500;">
                        <span>${it.name}</span>
                        <span>${it.price}€</span>
                    </div>`;
        });
        list.innerHTML = html;
    }
    
    // Το σύνολο κάτω-κάτω σε ΜΑΥΡΟ
    if (totalDisp) {
        totalDisp.style.color = "white";
        totalDisp.innerText = total.toFixed(2) + "€";
    }
}

// Λοιπές συναρτήσεις για τα κουμπιά
function sendToKitchen() {
    let kitchenHTML = `<div style="width: 80mm; font-family: monospace; color: black; padding: 10px;">
        <h2 style="text-align:center; border-bottom:1px solid #000;">ΠΑΡΑΓΓΕΛΙΑ</h2>
        <h3 style="text-align:center;">${selectedTable}</h3>`;
    
    currentOrder.forEach(it => {
        kitchenHTML += `<div style="font-size: 20px; font-weight: bold;">- ${it.name}</div>`;
    });
    
    kitchenHTML += `</div>`;

    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write('<html><body onload="window.print();window.close()">' + kitchenHTML + '</body></html>');
    printWindow.document.close();
}
function printFinalBill() {
    let receiptHTML = `<div style="width: 80mm; font-family: monospace; color: black; padding: 10px;">
        <h2 style="text-align:center;">ΡΩΞΑΝΗ</h2>
        <h3 style="text-align:center; border-bottom:1px solid #000;">${selectedTable}</h3>`;
    
    currentOrder.forEach(it => {
        receiptHTML += `<div style="display:flex; justify-content:space-between;">
            <span>${it.name}</span><span>${it.price}€</span>
        </div>`;
    });
    
    receiptHTML += `<h2 style="text-align:right; border-top:1px solid #000; margin-top:10px;">ΣΥΝΟΛΟ: ${document.getElementById('totalAmount').innerText}</h2></div>`;

    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write('<html><body onload="window.print();window.close()">' + receiptHTML + '</body></html>');
    printWindow.document.close();
}
function clearCurrentScreen() { currentOrder = []; selectedTable = "Κανένα"; updateOrderDisplay(); }
function startDelivery() { alert("Λειτουργία Delivery"); }
function checkCustomer() {}
function showDailyTotal() { alert("Σύνολο: " + document.getElementById('totalAmount').innerText); }