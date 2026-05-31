# Cash-Flow: Salary & Expense Tracker Dashboard

A robust and responsive financial dashboard built entirely using **Vanilla JavaScript** and **Tailwind CSS**. This module allows users to manage their income, track itemized expenses, and view real-time state visualization.

## 🚀 Features

### Phase 1: Base MVP
* **Input Architecture:** Dynamic form capturing Total Salary, Expense Name, and Expense Amount.
* **State Logic:** Real-time calculation and DOM rendering of Total Salary, Total Expenses, and Remaining Balance.
* **Validation Check:** Built-in error validation to prevent empty fields or negative number inputs.

### Phase 2: Data Persistence & Visualization
* **Local Storage:** Full state serialization using JSON to ensure data persists across browser reloads.
* **Delete Operation:** Interactive trash action to instantly remove specific expenses, sync storage, and recalculate balance.
* **Data Visualization:** Integration of a dynamic Pie Chart via **Chart.js** displaying Remaining Balance vs. Total Expenses.

### Phase 3: Stretch Goals
* **Report Generation:** PDF export functionality using the **jsPDF** library to download itemized statements.
* **Currency Conversion:** Asynchronous toggle feature using the **Frankfurter API** to switch dashboard data between INR and USD formats.
* **Threshold Alerts:** Dynamic warning trigger that turns the balance UI RED when the remaining balance drops below 10% of the total salary.

## 🛠️ Tech Stack Used
* **Structure/Styling:** HTML5, Tailwind CSS (via CDN)
* **Logic/Engine:** Vanilla JavaScript (ES6+)
* **Libraries:** Chart.js (Visualization), jsPDF (PDF Export)
* **API:** Frankfurter API (Currency Exchange)

## 📦 How to Run the Project Locally
1. Clone this repository to your local system:
```bash
   git clone [https://github.com/btwitsnaushad/cash-flow-tracker.git](https://github.com/btwitsnaushad/cash-flow-tracker.git)