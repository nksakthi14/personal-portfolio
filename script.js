// Get HTML elements
const form = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transactionList");
const filterInput = document.getElementById("filter");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");

const submitBtn = document.getElementById("submitBtn");

// Load transactions from Local Storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;


// Set today's date automatically
dateInput.value = new Date().toISOString().split("T")[0];


// Add / Update Transaction
form.addEventListener("submit", function (e) {

    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!description || amount <= 0 || !date) {
        alert("Please enter valid details.");
        return;
    }

    if (editId !== null) {

        // Update existing transaction
        transactions = transactions.map(transaction => {

            if (transaction.id === editId) {
                return {
                    id: editId,
                    description,
                    amount,
                    type,
                    category,
                    date
                };
            }

            return transaction;
        });

        editId = null;
        submitBtn.textContent = "Add Transaction";

    } else {

        // Create new transaction
        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
            category,
            date
        };

        transactions.push(transaction);
    }

    saveTransactions();
    displayTransactions();
    updateSummary();

    form.reset();

    // Reset date after form reset
    dateInput.value = new Date().toISOString().split("T")[0];

});


// Save transactions to Local Storage
function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// Display transactions
function displayTransactions() {

    const selectedCategory = filterInput.value;

    let filteredTransactions = transactions;

    if (selectedCategory !== "all") {

        filteredTransactions = transactions.filter(
            transaction => transaction.category === selectedCategory
        );

    }

    // Sort newest first
    filteredTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    transactionList.innerHTML = "";

    if (filteredTransactions.length === 0) {

        transactionList.innerHTML =
            `<div class="empty">No transactions found.</div>`;

        return;
    }

    filteredTransactions.forEach(transaction => {

        const div = document.createElement("div");

        div.className = "transaction";

        const sign = transaction.type === "income" ? "+" : "-";

        const amountClass =
            transaction.type === "income"
                ? "income-amount"
                : "expense-amount";

        div.innerHTML = `
            <div class="transaction-info">
                <h3>${transaction.description}</h3>
                <p>
                    ${transaction.category}
                    • ${formatDate(transaction.date)}
                </p>
            </div>

            <div class="transaction-amount ${amountClass}">
                ${sign} ₹${transaction.amount.toFixed(2)}
            </div>

            <div class="actions">
                <button
                    class="edit-btn"
                    onclick="editTransaction(${transaction.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            </div>
        `;

        transactionList.appendChild(div);

    });
}


// Update summary cards
function updateSummary() {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    const currentBalance = income - expense;

    totalIncome.textContent =
        `₹${income.toFixed(2)}`;

    totalExpense.textContent =
        `₹${expense.toFixed(2)}`;

    balance.textContent =
        `₹${currentBalance.toFixed(2)}`;
}


// Edit transaction
function editTransaction(id) {

    const transaction =
        transactions.find(item => item.id === id);

    if (!transaction) return;

    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    categoryInput.value = transaction.category;
    dateInput.value = transaction.date;

    editId = id;

    submitBtn.textContent = "Update Transaction";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Delete transaction
function deleteTransaction(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this transaction?");

    if (!confirmDelete) return;

    transactions =
        transactions.filter(transaction => transaction.id !== id);

    saveTransactions();
    displayTransactions();
    updateSummary();
}


// Filter transactions
filterInput.addEventListener("change", function () {

    displayTransactions();

});


// Format date
function formatDate(date) {

    const dateObject = new Date(date);

    return dateObject.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// Initial display
displayTransactions();
updateSummary();