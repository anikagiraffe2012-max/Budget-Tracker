const balanceEl = document.getElementById('balance');
const incomeTotalEl = document.getElementById('incomeTotal');
const expenseTotalEl = document.getElementById('expenseTotal');
const transactionList = document.getElementById('transactionList');
const form = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInputs = document.querySelectorAll('input[name="type"]');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

function updateSummary() {
    const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
    const balance = amounts.reduce((acc, val) => acc + val, 0);
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    balanceEl.textContent = formatCurrency(balance);
    incomeTotalEl.textContent = formatCurrency(income);
    expenseTotalEl.textContent = formatCurrency(expense);
}

function renderTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.className = `transaction-item ${transaction.type}`;

        const sign = transaction.type === 'income' ? '+' : '-';

        li.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-desc">${transaction.description}</span>
            </div>
            <div class="transaction-amount">${sign}${formatCurrency(transaction.amount)}</div>
            <button class="delete-btn" data-index="${index}">✕</button>
        `;

        transactionList.appendChild(li);
    });
}

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    let type = 'income';
    for (let radio of typeInputs) {
        if (radio.checked) {
            type = radio.value;
            break;
        }
    }

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and amount.');
        return;
    }

    const transaction = { description, amount, type };
    transactions.push(transaction);

    saveToLocalStorage();
    updateSummary();
    renderTransactions();

    form.reset();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveToLocalStorage();
    updateSummary();
    renderTransactions();
}

transactionList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index);
        deleteTransaction(index);
    }
});

function init() {
    renderTransactions();
    updateSummary();
}

form.addEventListener('submit', addTransaction);
init();
