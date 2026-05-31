// --- State Management ---
let appState = {
    totalSalary: 0,
    expenses: [], 
    currency: 'INR', 
    exchangeRate: 0.012 
};

let chartInstance = null;

// --- DOM Elements ---
const form = document.getElementById('cashFlowForm');
const inputSalary = document.getElementById('inputSalary');
const inputExpenseName = document.getElementById('inputExpenseName');
const inputExpenseAmount = document.getElementById('inputExpenseAmount');
const errorState = document.getElementById('errorState');

const displaySalary = document.getElementById('displaySalary');
const displayExpenses = document.getElementById('displayExpenses');
const displayBalance = document.getElementById('displayBalance');
const balanceCard = document.getElementById('balanceCard');
const thresholdAlert = document.getElementById('thresholdAlert');

const expenseList = document.getElementById('expenseList');
const emptyStateText = document.getElementById('emptyStateText');
const currencyToggleBtn = document.getElementById('currencyToggleBtn');
const downloadReportBtn = document.getElementById('downloadReportBtn');

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    fetchExchangeRate(); 
    renderDOM();
});

// --- API Integration ---
async function fetchExchangeRate() {
    try {
        const response = await fetch('https://api.frankfurter.app/latest?from=INR&to=USD');
        if (response.ok) {
            const data = await response.json();
            appState.exchangeRate = data.rates.USD;
        }
    } catch (error) {
        console.error("Currency API failed, using standard conversion rate.", error);
    }
}

// --- Form Submission & Validation ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorState.classList.add('hidden');
    errorState.innerText = '';

    const salaryVal = inputSalary.value.trim() !== "" ? Number(inputSalary.value) : null;
    const expName = inputExpenseName.value.trim();
    const expAmountVal = inputExpenseAmount.value.trim() !== "" ? Number(inputExpenseAmount.value) : null;

    if (salaryVal !== null && salaryVal < 0) {
        showError("Salary cannot be negative.");
        return;
    }
    if ((expName !== "" && expAmountVal === null) || (expName === "" && expAmountVal !== null)) {
        showError("Both Expense Name and Amount are required to add an expense.");
        return;
    }
    if (expAmountVal !== null && expAmountVal <= 0) {
        showError("Expense amount must be greater than zero.");
        return;
    }

    if (salaryVal !== null) {
        if (appState.currency === 'USD') {
            appState.totalSalary = salaryVal / appState.exchangeRate;
        } else {
            appState.totalSalary = salaryVal;
        }
    }

    if (expName && expAmountVal) {
        let finalAmountInBase = expAmountVal;
        if (appState.currency === 'USD') {
            finalAmountInBase = expAmountVal / appState.exchangeRate;
        }
        
        appState.expenses.push({
            id: Date.now().toString(),
            name: expName,
            amount: finalAmountInBase
        });

        inputExpenseName.value = '';
        inputExpenseAmount.value = '';
    }

    saveToLocalStorage();
    renderDOM();
});

function showError(message) {
    errorState.innerText = message;
    errorState.classList.remove('hidden');
}

// --- Calculations Helpers ---
function calculateMetrics() {
    const totalExpenses = appState.expenses.reduce((sum, item) => sum + item.amount, 0);
    const remainingBalance = appState.totalSalary - totalExpenses;
    return { totalExpenses, remainingBalance };
}

function formatCurrency(amountInBase) {
    let amount = amountInBase;
    if (appState.currency === 'USD') {
        amount = amountInBase * appState.exchangeRate;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

// --- DOM Rendering Engine ---
function renderDOM() {
    const { totalExpenses, remainingBalance } = calculateMetrics();

    displaySalary.innerText = formatCurrency(appState.totalSalary);
    displayExpenses.innerText = formatCurrency(totalExpenses);
    displayBalance.innerText = formatCurrency(remainingBalance);

    const threshold = appState.totalSalary * 0.10;
    if (appState.totalSalary > 0 && remainingBalance < threshold) {
        balanceCard.className = "bg-red-50 p-6 rounded-xl shadow-md border-b-4 border-red-600";
        displayBalance.className = "text-2xl font-bold text-red-600 mt-1";
        thresholdAlert.classList.remove('hidden'); 
    } else {
        balanceCard.className = "bg-white p-6 rounded-xl shadow-md border-b-4 border-green-500";
        displayBalance.className = "text-2xl font-bold text-gray-800 mt-1";
        thresholdAlert.classList.add('hidden');
    }

    expenseList.innerHTML = '';
    if (appState.expenses.length === 0) {
        emptyStateText.classList.remove('hidden');
    } else {
        emptyStateText.classList.add('hidden');
        appState.expenses.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 transition";
            tr.innerHTML = `
                <td class="p-3 font-medium text-gray-700">${item.name}</td>
                <td class="p-3 text-right font-semibold text-gray-900">${formatCurrency(item.amount)}</td>
                <td class="p-3 text-center">
                    <button onclick="deleteExpense('${item.id}')" class="text-red-500 hover:text-red-700 font-medium p-1 transition" title="Delete Expense">
                        🗑️
                    </button>
                </td>
            `;
            expenseList.appendChild(tr);
        });
    }

    renderChart(totalExpenses, remainingBalance);
}

// --- Delete Operation ---
window.deleteExpense = function(id) {
    appState.expenses = appState.expenses.filter(item => item.id !== id);
    saveToLocalStorage(); 
    renderDOM(); 
}

// --- Chart.js Rendering Logic ---
function renderChart(totalExpenses, remainingBalance) {
    const ctx = document.getElementById('analyticsChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    const baseBalance = remainingBalance < 0 ? 0 : remainingBalance;

    chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Remaining Balance', 'Total Expenses'],
            datasets: [{
                data: [baseBalance, totalExpenses],
                backgroundColor: ['#10B981', '#F59E0B'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// --- Local Storage Serialization ---
function saveToLocalStorage() {
    localStorage.setItem('cashFlow_totalSalary', JSON.stringify(appState.totalSalary));
    localStorage.setItem('cashFlow_expenses', JSON.stringify(appState.expenses));
}

function loadFromLocalStorage() {
    const savedSalary = localStorage.getItem('cashFlow_totalSalary');
    const savedExpenses = localStorage.getItem('cashFlow_expenses');

    if (savedSalary !== null) {
        appState.totalSalary = JSON.parse(savedSalary);
    }
    if (savedExpenses !== null) {
        appState.expenses = JSON.parse(savedExpenses);
    }
}

// --- Currency Toggling ---
currencyToggleBtn.addEventListener('click', () => {
    appState.currency = appState.currency === 'INR' ? 'USD' : 'INR';
    renderDOM();
});

// --- Report Generation Engine (jsPDF) ---
downloadReportBtn.addEventListener('click', () => {
    const { window } = globalThis;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const { totalExpenses, remainingBalance } = calculateMetrics();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Cash-Flow Financial Statement", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Active Currency Format: ${appState.currency}`, 14, 34);
    doc.line(14, 38, 196, 38);

    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Executive Financial Summary:", 14, 48);
    
    doc.setFont("Helvetica", "normal");
    doc.text(`Total Salary Allocated: ${formatCurrency(appState.totalSalary)}`, 14, 56);
    doc.text(`Cumulative Expenses: ${formatCurrency(totalExpenses)}`, 14, 64);
    doc.text(`Net Remaining Balance: ${formatCurrency(remainingBalance)}`, 14, 72);
    doc.line(14, 78, 196, 78);

    doc.setFont("Helvetica", "bold");
    doc.text("Itemized Expense Logs:", 14, 88);

    doc.setFontSize(11);
    let yPosition = 98;
    doc.text("Expense Particulars", 14, yPosition);
    doc.text("Amount Assessed", 140, yPosition);
    doc.line(14, yPosition + 2, 196, yPosition + 2);
    yPosition += 10;

    doc.setFont("Helvetica", "normal");
    if (appState.expenses.length === 0) {
        doc.text("No data items currently mapped to record statements.", 14, yPosition);
    } else {
        appState.expenses.forEach((item) => {
            if (yPosition > 270) { 
                doc.addPage();
                yPosition = 20;
            }
            doc.text(String(item.name), 14, yPosition);
            doc.text(String(formatCurrency(item.amount)), 140, yPosition);
            yPosition += 8;
        });
    }

    doc.save(`CashFlow_Statement_${Date.now()}.pdf`);
});