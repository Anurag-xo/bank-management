document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadUsers();
    loadAdminLoans();
});

function showSection(sectionId, navId) {
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('usersSection').style.display = 'none';
    document.getElementById('loansSection').style.display = 'none';

    document.getElementById(sectionId + 'Section').style.display = 'block';

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => link.classList.remove('active'));
    if (navId) {
        document.getElementById(navId).classList.add('active');
    } else {
        document.getElementById('nav-' + sectionId).classList.add('active');
    }
}

function loadDashboard() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    
    document.getElementById('customersCount').innerText = users.filter(u => u.role === 'customer').length;
    document.getElementById('employeesCount').innerText = users.filter(u => u.role === 'employee').length;
    document.getElementById('pendingLoansCount').innerText = loans.filter(l => l.status === 'pending').length;
}

function filterUsers(role) {
    showSection('users', 'nav-' + role);
    document.getElementById('manageUsersTitle').innerText = role === 'employee' ? 'Manage Employees' : 'Manage Customers';
    
    // Update Contextual Add User Form
    document.getElementById('addRole').value = role;
    document.getElementById('addUserBtnText').innerText = role === 'employee' ? 'Add Employee' : 'Add Customer';
    document.getElementById('addUserFormTitle').innerText = role === 'employee' ? 'Create New Employee' : 'Create New Customer';
    
    loadUsers(role);
}

function loadUsers(filterRole = null) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.getElementById('usersBody');
    tbody.innerHTML = '';
    
    users.forEach(u => {
        if (u.role === 'admin' && u.id === 1) return; // Hide main admin from list for safety
        if (filterRole && u.role !== filterRole) return; // Apply filter if set
        
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td><span class="badge bg-secondary">${u.role.toUpperCase()}</span></td>
                <td>${u.name}</td>
                <td>${u.username}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewUserDetails(${u.id})">View</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function handleUserSearch() {
    const query = document.getElementById('userSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#usersBody tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

function toggleAddUser() {
    const form = document.getElementById('addUserForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addUser(e) {
    e.preventDefault();
    const name = document.getElementById('addName').value;
    const username = document.getElementById('addUsername').value;
    const password = document.getElementById('addPassword').value;
    const email = document.getElementById('addEmail').value;
    const phone = document.getElementById('addPhone').value;
    const address = document.getElementById('addAddress').value;
    const role = document.getElementById('addRole').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === username)) {
        alert("Username already exists!");
        return;
    }

    const newUser = {
        id: new Date().getTime(),
        role: role,
        username: username,
        password: password,
        name: name,
        email: email,
        phone: phone,
        address: address
    };

    if (role === 'customer') {
        newUser.balance = 0;
        newUser.cibil = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
        newUser.status = 'active';
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showSuccess("User created successfully!");
    e.target.reset();
    toggleAddUser();
    loadUsers();
    loadDashboard();
}

function deleteUser(id) {
    showConfirm("Are you sure you want to delete this user?", () => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
        loadDashboard();
    });
}

function viewUserDetails(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === id);
    if (!user) return;

    let detailsHTML = `
        <div class="row">
            ${user.role === 'customer' ? `<div class="col-md-12 mb-3"><strong>Account Number:</strong> <span class="text-primary font-monospace" style="font-size: 1.2rem;">${1000000000 + user.id}</span></div>` : ''}
            <div class="col-md-6 mb-3"><strong>Full Name:</strong> ${user.name}</div>
            <div class="col-md-6 mb-3"><strong>Username:</strong> ${user.username}</div>
            <div class="col-md-6 mb-3"><strong>Role:</strong> <span class="badge bg-secondary">${user.role.toUpperCase()}</span></div>
            <div class="col-md-6 mb-3"><strong>Email:</strong> ${user.email || 'Not Provided'}</div>
            <div class="col-md-6 mb-3"><strong>Phone Number:</strong> ${user.phone || 'Not Provided'}</div>
            <div class="col-md-6 mb-3"><strong>Address:</strong> ${user.address || 'Not Provided'}</div>
        </div>
        <hr>
    `;

    if (user.role === 'customer') {
        const txs = JSON.parse(localStorage.getItem('transactions')) || [];
        const userTxs = txs.filter(t => t.customerId === id);
        detailsHTML += `
            <div class="row mb-3 p-3 bg-light rounded">
                <div class="col-md-4"><strong>Current Balance:</strong> <h4 class="text-success mb-0">₹${user.balance || 0}</h4></div>
                <div class="col-md-4"><strong>CIBIL Score:</strong> <h4 class="text-primary mb-0">${user.cibil || 'N/A'}</h4></div>
                <div class="col-md-4"><strong>Cards Held:</strong> 
                    <div class="mt-1"><i class="bi bi-credit-card text-secondary"></i> Debit Card (**** ${user.id.toString().slice(-4).padStart(4, '0')})</div>
                </div>
            </div>
            <h6>Recent Transactions Log:</h6>
            <ul class="list-group list-group-flush mb-3">
        `;
        if (userTxs.length === 0) detailsHTML += `<li class="list-group-item text-muted">No transactions found for this account.</li>`;
        userTxs.forEach(t => {
            detailsHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
                <span><i class="bi bi-arrow-right-circle me-2"></i>${t.type.toUpperCase()}</span> 
                <span class="fw-bold">₹${t.amount}</span> 
                <small class="text-muted">${new Date(t.date).toLocaleDateString()}</small>
            </li>`;
        });
        detailsHTML += `</ul>`;
    } else if (user.role === 'employee') {
        const loans = JSON.parse(localStorage.getItem('loans')) || [];
        const handled = loans.filter(l => l.appliedBy === user.username);
        detailsHTML += `
            <h6>Employee Performance Metrics:</h6>
            <div class="p-3 bg-light rounded mb-3">
                <p class="mb-1">Total Loans Processed/Applied: <strong class="fs-5">${handled.length}</strong></p>
            </div>
            <h6>Loans Handled Log:</h6>
            <ul class="list-group list-group-flush mb-3">
        `;
        if (handled.length === 0) detailsHTML += `<li class="list-group-item text-muted">No loans processed yet.</li>`;
        handled.forEach(l => {
            let b = l.status === 'approved' ? 'success' : (l.status === 'rejected' ? 'danger' : 'warning');
            detailsHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
                <span>Loan ID: ${l.id} (Cust: ${l.customerId})</span> 
                <span class="fw-bold">₹${l.amount}</span> 
                <span class="badge bg-${b}">${l.status.toUpperCase()}</span>
            </li>`;
        });
        detailsHTML += `</ul>`;
    }

    document.getElementById('viewUserBody').innerHTML = detailsHTML;
    const modal = new bootstrap.Modal(document.getElementById('viewUserModal'));
    modal.show();
}

function loadAdminLoans() {
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const tbody = document.getElementById('loansBody');
    tbody.innerHTML = '';
    
    loans.forEach(l => {
        let badge = l.status === 'approved' ? 'success' : (l.status === 'rejected' ? 'danger' : 'warning');
        let actions = `<button class="btn btn-sm btn-info me-1" onclick="viewLoanDetails(${l.id})">Track</button>`;
        if (l.status !== 'approved') {
            actions += `<button class="btn btn-sm btn-success me-1" onclick="updateLoanStatus(${l.id}, 'approved')">Approve</button>`;
        }
        if (l.status !== 'rejected') {
            actions += `<button class="btn btn-sm btn-danger" onclick="updateLoanStatus(${l.id}, 'rejected')">Reject</button>`;
        }
        
        tbody.innerHTML += `
            <tr>
                <td>${l.id}</td>
                <td>${l.customerId}</td>
                <td>₹${l.amount}</td>
                <td>${l.appliedBy}</td>
                <td>
                    ${l.document && l.document !== 'None' 
                        ? `<a href="#" onclick="showSuccess('Viewing document: ${l.document}')"><i class="bi bi-file-earmark-text"></i> ${l.document}</a>` 
                        : '<span class="text-muted">No Doc</span>'}
                </td>
                <td><span class="badge bg-${badge}">${l.status.toUpperCase()}</span></td>
                <td>${actions}</td>
            </tr>
        `;
    });
}

function updateLoanStatus(id, status) {
    let loans = JSON.parse(localStorage.getItem('loans')) || [];
    const idx = loans.findIndex(l => l.id === id);
    if (idx !== -1) {
        if(status === 'rejected' && loans[idx].status === 'approved') {
            showConfirm("Are you sure you want to revert this loan approval? This will deduct the amount from the customer's balance.", () => {
                let users = JSON.parse(localStorage.getItem('users')) || [];
                const uIdx = users.findIndex(u => u.id === loans[idx].customerId);
                if(uIdx !== -1) {
                    users[uIdx].balance -= parseFloat(loans[idx].amount);
                    localStorage.setItem('users', JSON.stringify(users));
                }
                loans[idx].status = status;
                localStorage.setItem('loans', JSON.stringify(loans));
                loadAdminLoans();
                loadDashboard();
                showSuccess("Loan approval reversed successfully.");
            });
            return;
        }

        loans[idx].status = status;
        
        localStorage.setItem('loans', JSON.stringify(loans));
        loadAdminLoans();
        loadDashboard();
    }
}

function viewLoanDetails(id) {
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const loan = loans.find(l => l.id === id);
    if (!loan) return;

    const timelineStep = loan.status === 'pending' ? 1 : (loan.status === 'approved' ? 3 : 2);
    
    const interestRate = loan.interest ? parseFloat(loan.interest) : 10.0;
    const loanDuration = loan.timeline ? parseInt(loan.timeline) : 12;

    const totalToRepay = loan.status === 'approved' ? parseFloat(loan.amount) * (1 + (interestRate / 100)) : 0;
    const moneyLeft = loan.status === 'approved' ? totalToRepay * 0.8 : 0;
    
    const fine = (loan.status === 'approved' && Math.random() < 0.3) ? 500 : 0;

    const html = `
        <h6 class="mb-3 text-muted">Loan ID: ${loan.id} (Cust: ${loan.customerId})</h6>
        
        <div class="p-3 bg-light rounded mb-4">
            <h5 class="text-primary mb-3">Application Timeline</h5>
            <ul class="list-unstyled mb-0">
                <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i> <strong>Step 1:</strong> Application Submitted</li>
                <li class="mb-2"><i class="bi ${timelineStep >= 2 ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2"></i> <strong>Step 2:</strong> Document Verification (Under Review)</li>
                <li class="mb-2"><i class="bi ${timelineStep === 3 ? 'bi-check-circle-fill text-success' : (loan.status === 'rejected' ? 'bi-x-circle-fill text-danger' : 'bi-circle text-muted')} me-2"></i> <strong>Step 3:</strong> Final Decision (${loan.status.toUpperCase()})</li>
            </ul>
        </div>

        <div class="row g-3">
            <div class="col-6">
                <div class="p-3 border rounded text-center">
                    <p class="text-muted mb-1" style="font-size:0.9rem;">Principal Amount</p>
                    <h5 class="mb-0">₹${loan.amount}</h5>
                    <small class="text-muted">${interestRate}% p.a. for ${loanDuration} months</small>
                </div>
            </div>
            <div class="col-6">
                <div class="p-3 border rounded text-center">
                    <p class="text-muted mb-1" style="font-size:0.9rem;">Status</p>
                    <h5 class="mb-0 text-${loan.status === 'approved' ? 'success' : (loan.status==='rejected'?'danger':'warning')}">${loan.status.toUpperCase()}</h5>
                </div>
            </div>
            <div class="col-6">
                <div class="p-3 border rounded text-center">
                    <p class="text-muted mb-1" style="font-size:0.9rem;">Outstanding Balance</p>
                    <h5 class="mb-0 ${loan.status === 'approved' ? 'text-danger' : ''}">${loan.status === 'approved' ? '₹' + moneyLeft.toFixed(2) : 'N/A'}</h5>
                </div>
            </div>
            <div class="col-6">
                <div class="p-3 border rounded text-center">
                    <p class="text-muted mb-1" style="font-size:0.9rem;">Active Fines/Penalties</p>
                    <h5 class="mb-0 text-danger">${fine > 0 ? '₹' + fine + ' (Late Fee)' : '₹0'}</h5>
                </div>
            </div>
        </div>
    `;

    document.getElementById('viewLoanBody').innerHTML = html;
    const modal = new bootstrap.Modal(document.getElementById('viewLoanModal'));
    modal.show();
}

function showSuccess(message) {
    document.getElementById('successModalMessage').innerText = message;
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

let pendingConfirmAction = null;

function showConfirm(message, callback) {
    document.getElementById('confirmModalMessage').innerText = message;
    pendingConfirmAction = callback;
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

function executeConfirm() {
    if(pendingConfirmAction) pendingConfirmAction();
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    if(modal) modal.hide();
    pendingConfirmAction = null;
    
    // Cleanup backdrop
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style = '';
}
