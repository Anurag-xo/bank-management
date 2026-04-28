/* ============================================
   TRANSACTION PAGE JS
   ============================================ */

function handleTransaction(event) {
  event.preventDefault();

  var transId = document.getElementById("transId").value.trim();
  var ssn = document.getElementById("transSsn").value.trim();
  var name = document.getElementById("transCustomerName").value.trim();
  var occupation = document.getElementById("transOccupation").value.trim();
  var account = document.getElementById("transAccount").value.trim();
  var aadhar = document.getElementById("transAadhar").value.trim();
  var pan = document.getElementById("transPan").value.trim();
  var address = document.getElementById("transAddress").value.trim();
  var date = document.getElementById("transDate").value;
  var contact = document.getElementById("transContact").value.trim();
  var type = document.getElementById("transType").value;
  var amount = document.getElementById("transAmount").value.trim();

  // Basic validation
  if (
    !transId ||
    !ssn ||
    !name ||
    !occupation ||
    !account ||
    !aadhar ||
    !pan ||
    !address ||
    !date ||
    !contact ||
    !type ||
    !amount
  ) {
    showToast("Please fill in all required fields.", true);
    return;
  }

  if (parseFloat(amount) <= 0) {
    showToast("Amount must be greater than zero.", true);
    return;
  }

  if (aadhar.replace(/\D/g, "").length !== 12) {
    showToast("Aadhar number must be 12 digits.", true);
    return;
  }

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase())) {
    showToast("Enter a valid PAN card number.", true);
    return;
  }

  // Processing state
  var btn = document.querySelector(".process-btn");
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-icon">⏳</span> Processing…';

  setTimeout(function () {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">⇄</span> Process Transaction';

    showToast(
      type +
        " of ₹" +
        parseFloat(amount).toLocaleString("en-IN") +
        " processed successfully for " +
        name +
        ".",
      false,
    );
    document.getElementById("transactionForm").reset();
  }, 900);
}

function showToast(message, isError) {
  var toast = document.getElementById("toast");
  var toastInner = document.getElementById("toastInner");
  var toastBody = document.getElementById("toastBody");
  var toastIcon = document.getElementById("toastIcon");

  toastBody.textContent = message;
  toastIcon.textContent = isError ? "✕" : "✓";
  toastInner.className = "toast-inner " + (isError ? "error" : "success");

  toast.style.display = "block";

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(function () {
    toast.style.display = "none";
  }, 3500);
}
