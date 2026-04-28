/* ============================================
   TRANSACTION HISTORY JS
   ============================================ */

var transactions = [
  {
    id: "TXN00125",
    mode: "Deposit",
    amount: 25000,
    datetime: "28 Apr 2026, 10:42 AM",
  },
  {
    id: "TXN00124",
    mode: "Withdrawal",
    amount: 5000,
    datetime: "27 Apr 2026, 04:18 PM",
  },
  {
    id: "TXN00123",
    mode: "Online",
    amount: 1800,
    datetime: "26 Apr 2026, 11:09 AM",
  },
];

var container = document.getElementById("transactionList");

transactions.forEach(function (tx) {
  var row = document.createElement("div");
  row.className = "history-row";

  row.innerHTML = `
    <span>${tx.id}</span>
    <span>${tx.mode}</span>
    <span class="amount">₹${tx.amount.toLocaleString("en-IN")}</span>
    <span>${tx.datetime}</span>
    <span>
      <button class="action-btn" onclick="viewTransaction('${tx.id}')">
        View
      </button>
    </span>
  `;

  container.appendChild(row);
});

function viewTransaction(id) {
  showToast("Viewing details for " + id, false);
}

/* TOAST (same logic reused) */
function showToast(message, isError) {
  var toast = document.getElementById("toast");
  var toastInner = document.getElementById("toastInner");
  var toastBody = document.getElementById("toastBody");
  var toastIcon = document.getElementById("toastIcon");

  toastBody.textContent = message;
  toastIcon.textContent = isError ? "✕" : "✓";
  toastInner.className = "toast-inner " + (isError ? "error" : "success");

  toast.style.display = "block";
  clearTimeout(toast._timer);

  toast._timer = setTimeout(function () {
    toast.style.display = "none";
  }, 3000);
}
``;
