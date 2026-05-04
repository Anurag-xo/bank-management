document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    loadCustomers();
    loadProfileUpdates();
    loadReviewLoans();
    loadMyForwardedLoans();
    
    document.getElementById('empLoanForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const cid = document.getElementById('loanCustId').value;
        const type = document.getElementById('empLoanType').value;
        const amt = document.getElementById('empLoanAmount').value;
        const interest = document.getElementById('empLoanInterest').value;
        const timeline = document.getElementById('empLoanTimeline').value;
        const docInput = document.getElementById('empLoanDoc');
        const docName = docInput.files.length > 0 ? docInput.files[0].name : 'None';
        const emp = getCurrentUser();
        
        const loans = JSON.parse(localStorage.getItem('loans')) || [];
        loans.push({
            id: new Date().getTime(),
            customerId: parseInt(cid),
            type: type,
            amount: amt,
            interest: interest,
            timeline: timeline,
            document: docName,
            status: 'pending',
            appliedBy: emp.username
        });
        localStorage.setItem('loans', JSON.stringify(loans));
        showSuccess('Loan application submitted to Admin successfully!');
        document.getElementById('empLoanForm').reset();
        loadDashboard();
        loadMyForwardedLoans();
    });
});

function updateEmpInterestRate() {
    const typeSelect = document.getElementById('empLoanType');
    const selectedOption = typeSelect.options[typeSelect.selectedIndex];
    if(selectedOption && selectedOption.dataset.rate) {
        document.getElementById('empLoanInterest').value = selectedOption.dataset.rate;
    }
}

function loadDashboard() {
    const emp = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const txs = JSON.parse(localStorage.getItem('transactions')) || [];
    
    const customersCount = users.filter(u => u.role === 'customer').length;
    const handledLoans = loans.filter(l => l.appliedBy === emp.username);
    const activeLoans = handledLoans.filter(l => l.status === 'approved').length;
    const pendingLoans = handledLoans.filter(l => l.status === 'pending').length;
    const reviewLoansCount = loans.filter(l => l.status === 'pending_emp').length;

    document.getElementById('empTotalCust').innerText = customersCount;
    document.getElementById('empActiveLoans').innerText = activeLoans;
    document.getElementById('empPendingLoans').innerText = pendingLoans;
    document.getElementById('empReviewLoans').innerText = reviewLoansCount;

    // Generate Recent Activity
    const log = document.getElementById('empActivityLog');
    log.innerHTML = '';
    
    let activities = [];
    handledLoans.slice(-2).reverse().forEach(l => {
        activities.push(`<li class="list-group-item px-0"><i class="bi bi-file-text text-primary me-2"></i> Submitted loan application for Customer ID ${l.customerId}</li>`);
    });
    
    const updates = JSON.parse(localStorage.getItem('profileUpdates')) || [];
    updates.slice(-2).reverse().forEach(u => {
        let textClass = u.status === 'approved' ? 'text-success' : (u.status === 'rejected' ? 'text-danger' : 'text-warning');
        activities.push(`<li class="list-group-item px-0"><i class="bi bi-person-lines-fill ${textClass} me-2"></i> Profile update ${u.status} for Customer ID ${u.customerId}</li>`);
    });

    if (activities.length === 0) {
        log.innerHTML = '<li class="list-group-item px-0 text-muted">No recent activity found.</li>';
    } else {
        log.innerHTML = activities.join('');
    }
}

function showSection(sectionId) {
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('customersSection').style.display = 'none';
    document.getElementById('profileUpdatesSection').style.display = 'none';
    document.getElementById('reviewLoansSection').style.display = 'none';
    document.getElementById('loansSection').style.display = 'none';

    document.getElementById(sectionId + 'Section').style.display = 'block';

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function loadMyForwardedLoans() {
    const emp = getCurrentUser();
    if(!emp) return;
    
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const myLoans = loans.filter(l => l.appliedBy === emp.username || l.reviewedBy === emp.username);
    
    const tbody = document.getElementById('myForwardedLoansBody');
    if(!tbody) return;
    tbody.innerHTML = '';
    myLoans.forEach(l => {
        let badge = l.status === 'approved' ? 'success' : (l.status === 'rejected' ? 'danger' : 'warning');
        let statusDisplay = l.status.toUpperCase();
        if(l.status === 'pending') statusDisplay = 'ADMIN REVIEW';
        if(l.status === 'pending_emp') statusDisplay = 'EMP REVIEW';
        
        let type = l.appliedBy === emp.username ? '<span class="badge bg-primary">Proxy Application</span>' : '<span class="badge bg-info text-dark">Forwarded</span>';
        
        tbody.innerHTML += `<tr>
            <td>${l.id}</td>
            <td>${l.customerId}</td>
            <td>₹${l.amount}</td>
            <td>${type}</td>
            <td><span class="badge bg-${badge}">${statusDisplay}</span></td>
        </tr>`;
    });
}

function loadCustomers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const customers = users.filter(u => u.role === 'customer');
    
    const tbody = document.getElementById('customersBody');
    const select = document.getElementById('loanCustId');
    tbody.innerHTML = '';
    select.innerHTML = '';
    
    customers.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.username}</td>
                <td>₹${c.balance || 0}</td>
                <td>${c.cibil || 0}</td>
                <td>
                    <button class="btn btn-sm btn-success me-1" onclick="openDepositModal(${c.id}, '${c.name.replace(/'/g, "\\'")}')">Deposit</button>
                    <button class="btn btn-sm btn-info me-1" onclick="viewUserDetails(${c.id})">View</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${c.id})">Del</button>
                </td>
            </tr>
        `;
        select.innerHTML += `<option value="${c.id}">${c.name} (ID: ${c.id})</option>`;
    });
}

function handleCustomerSearch() {
    const query = document.getElementById('customerSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#customersBody tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

function toggleAddCustomer() {
    const form = document.getElementById('addCustomerForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addCustomer(e) {
    e.preventDefault();
    const name = document.getElementById('addName').value;
    const username = document.getElementById('addUsername').value;
    const password = document.getElementById('addPassword').value;
    const email = document.getElementById('addEmail').value;
    const phone = document.getElementById('addPhone').value;
    const address = document.getElementById('addAddress').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === username)) {
        alert("Username already exists!");
        return;
    }

    users.push({
        id: new Date().getTime(),
        role: 'customer',
        username: username,
        password: password,
        name: name,
        email: email,
        phone: phone,
        address: address,
        balance: 0,
        cibil: Math.floor(Math.random() * (850 - 300 + 1)) + 300,
        status: 'active'
    });
    localStorage.setItem('users', JSON.stringify(users));
    showSuccess("Customer created successfully!");
    e.target.reset();
    toggleAddCustomer();
    loadCustomers();
}

function deleteCustomer(id) {
    showConfirm("Are you sure you want to delete this customer?", () => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        loadCustomers();
    });
}

function openDepositModal(id, name) {
    document.getElementById('depositCustId').value = id;
    document.getElementById('depositModalTitle').innerText = `Deposit to ${name}`;
    document.getElementById('depositAmount').value = '';
    const modal = new bootstrap.Modal(document.getElementById('depositModal'));
    modal.show();
}

function confirmDeposit() {
    const id = parseInt(document.getElementById('depositCustId').value);
    const amount = parseFloat(document.getElementById('depositAmount').value);
    
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIdx = users.findIndex(u => u.id === id);
    
    if (userIdx !== -1) {
        users[userIdx].balance = (parseFloat(users[userIdx].balance) || 0) + amount;
        localStorage.setItem('users', JSON.stringify(users));
        
        let txs = JSON.parse(localStorage.getItem('transactions')) || [];
        txs.push({
            id: new Date().getTime(),
            customerId: id,
            type: 'deposit',
            amount: amount,
            date: new Date().toISOString()
        });
        localStorage.setItem('transactions', JSON.stringify(txs));
        
        showSuccess(`Successfully deposited ₹${amount} into the account.`);
        const modal = bootstrap.Modal.getInstance(document.getElementById('depositModal'));
        if(modal) modal.hide();
        
        // Cleanup backdrop if it gets stuck
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style = '';

        loadCustomers();
    } else {
        alert("Customer not found.");
    }
}

function viewSelectedLoanCustomer() {
    const cid = document.getElementById('loanCustId').value;
    if (cid) {
        viewUserDetails(parseInt(cid));
    } else {
        alert("Please select a customer first.");
    }
}

function viewUserDetails(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === id);
    if (!user || user.role !== 'customer') return;

    let detailsHTML = `
        <div class="row">
            <div class="col-md-12 mb-3"><strong>Account Number:</strong> <span class="text-primary font-monospace" style="font-size: 1.2rem;">${1000000000 + user.id}</span></div>
            <div class="col-md-6 mb-3"><strong>Full Name:</strong> ${user.name}</div>
            <div class="col-md-6 mb-3"><strong>Username:</strong> ${user.username}</div>
            <div class="col-md-6 mb-3"><strong>Role:</strong> <span class="badge bg-secondary">${user.role.toUpperCase()}</span></div>
            <div class="col-md-6 mb-3"><strong>Email:</strong> ${user.email || 'Not Provided'}</div>
            <div class="col-md-6 mb-3"><strong>Phone Number:</strong> ${user.phone || 'Not Provided'}</div>
            <div class="col-md-6 mb-3"><strong>Address:</strong> ${user.address || 'Not Provided'}</div>
        </div>
        <hr>
    `;

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

    document.getElementById('viewUserBody').innerHTML = detailsHTML;
    const modal = new bootstrap.Modal(document.getElementById('viewUserModal'));
    modal.show();
}

function loadReviewLoans() {
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const pendingEmp = loans.filter(l => l.status === 'pending_emp');
    const tbody = document.getElementById('reviewLoansBody');
    tbody.innerHTML = '';
    
    if(pendingEmp.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No loans pending your review.</td></tr>';
        return;
    }
    
    pendingEmp.forEach(l => {
        tbody.innerHTML += `
            <tr>
                <td>${l.id}</td>
                <td>${l.customerId}</td>
                <td>₹${l.amount}</td>
                <td>
                    ${l.document && l.document !== 'None' 
                        ? `<a href="#" onclick="alert('Viewing document: ${l.document}')"><i class="bi bi-file-earmark-text"></i> ${l.document}</a>` 
                        : '<span class="text-muted">No Doc</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-info me-1" onclick="viewUserDetails(${l.customerId})">Check Profile</button>
                    <button class="btn btn-sm btn-success me-1" onclick="acceptCustomerLoan(${l.id})">Forward to Admin</button>
                    <button class="btn btn-sm btn-danger" onclick="rejectCustomerLoan(${l.id})">Reject</button>
                </td>
            </tr>
        `;
    });
}

function acceptCustomerLoan(id) {
    let loans = JSON.parse(localStorage.getItem('loans')) || [];
    const idx = loans.findIndex(l => l.id === id);
    if (idx !== -1) {
        loans[idx].status = 'pending'; // Moves it to admin's queue
        loans[idx].reviewedBy = getCurrentUser().username;
        localStorage.setItem('loans', JSON.stringify(loans));
        showSuccess('Loan forwarded to Admin for final approval.');
        loadReviewLoans();
        loadDashboard();
        loadMyForwardedLoans();
    }
}

function rejectCustomerLoan(id) {
    let loans = JSON.parse(localStorage.getItem('loans')) || [];
    const idx = loans.findIndex(l => l.id === id);
    if (idx !== -1) {
        loans[idx].status = 'rejected';
        loans[idx].reviewedBy = getCurrentUser().username;
        localStorage.setItem('loans', JSON.stringify(loans));
        showSuccess('Loan rejected.');
        loadReviewLoans();
        loadDashboard();
        loadMyForwardedLoans();
    }
}

function loadProfileUpdates() {
    const updates = JSON.parse(localStorage.getItem('profileUpdates')) || [];
    const pendingUpdates = updates.filter(u => u.status === 'pending');
    const tbody = document.getElementById('profileUpdatesBody');
    tbody.innerHTML = '';

    pendingUpdates.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.customerId}</td>
                <td>${u.newName}</td>
                <td>${u.newEmail}</td>
                <td>${u.newPhone}</td>
                <td>${u.newAddress}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="processProfileUpdate(${u.id}, 'approved')">Approve</button>
                    <button class="btn btn-sm btn-danger" onclick="processProfileUpdate(${u.id}, 'rejected')">Reject</button>
                </td>
            </tr>
        `;
    });
}

function processProfileUpdate(reqId, action) {
    let updates = JSON.parse(localStorage.getItem('profileUpdates')) || [];
    const idx = updates.findIndex(u => u.id === reqId);
    if (idx !== -1) {
        updates[idx].status = action;
        
        if (action === 'approved') {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIdx = users.findIndex(user => user.id === updates[idx].customerId);
            if (userIdx !== -1) {
                users[userIdx].name = updates[idx].newName || users[userIdx].name;
                users[userIdx].email = updates[idx].newEmail || users[userIdx].email;
                users[userIdx].phone = updates[idx].newPhone || users[userIdx].phone;
                users[userIdx].address = updates[idx].newAddress || users[userIdx].address;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }

        localStorage.setItem('profileUpdates', JSON.stringify(updates));
        loadProfileUpdates();
        loadCustomers();
    }
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
