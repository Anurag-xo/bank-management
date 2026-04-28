function handleCustomerAction(action) {
  var ssnId = document.getElementById("customerSsn").value.trim();
  var name = document.getElementById("customerName").value.trim();
  var account = document.getElementById("accountNumber").value.trim();
  var email = document.getElementById("customerEmail").value.trim();
  var contact = document.getElementById("customerContact").value.trim();

  if (!ssnId || !name) {
    showToast("Please enter SSN ID and Name", true);
    return;
  }

  let customers = JSON.parse(localStorage.getItem("customers")) || [];

  if (action === "add") {
    customers.push({ ssnId, name, account, email, contact });
    localStorage.setItem("customers", JSON.stringify(customers));
    showToast("Customer added successfully", false);
  }
}
function toggleCustomerMenu() {
  var submenu = document.getElementById("customerSubmenu");

  if (submenu.style.display === "block") {
    submenu.style.display = "none";
  } else {
    submenu.style.display = "block";
  }
}
