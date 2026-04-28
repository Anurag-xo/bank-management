
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Customers</title>
    <link rel="stylesheet" href="shared-style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="sidebar">
    <h2>TCS Bank</h2>
    <a href="dashboard.html">Dashboard</a>
    <a href="customer.html">Add Customer</a>
    <a href="view-customers.html" class="active">View Customers</a>
</div>

<div class="main-content">
    <h2 class="mb-4">Customer List</h2>

    <table class="table table-bordered table-striped shadow">
        <thead class="table-primary">
            <tr>
                <th>SSN ID</th>
                <th>Name</th>
                <th>Account No</th>
                <th>Email</th>
                <th>Contact</th>
            </tr>
        </thead>
        <tbody id="customerTableBody">
            <tr>
                <td>1001</td>
                <td>John Doe</td>
                <td>123456789</td>
                <td>john@email.com</td>
                <td>9876543210</td>
            </tr>
        </tbody>
    </table>
</div>
<script>
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let tableBody = document.getElementById("customerTableBody");

tableBody.innerHTML = "";

customers.forEach(customer => {
    tableBody.innerHTML += `
        <tr>
            <td>${customer.ssnId}</td>
            <td>${customer.name}</td>
            <td>${customer.account}</td>
            <td>${customer.email}</td>
            <td>${customer.contact}</td>
        </tr>
    `;
});
</script>
</body>
</html>
