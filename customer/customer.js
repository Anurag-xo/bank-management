document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (!user) return;

    // Set Dashboard Data
    document.getElementById('accBalance').innerText = `₹${user.balance || 0}`;
    document.getElementById('accCibil').innerText = user.cibil || 0;
    
    // Set Profile
    document.getElementById('profName').value = user.name || '';
    document.getElementById('profUser').value = user.username || '';
    document.getElementById('profEmail').value = user.email || '';
    document.getElementById('profPhone').value = user.phone || '';
    document.getElementById('profAddress').value = user.address || '';

    loadTransactions(user.id);
    loadLoans(user.id);
    loadProfileUpdates(user.id);
    loadServiceRequests(user.id);

    // Profile Update Request
    document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const updates = JSON.parse(localStorage.getItem('profileUpdates')) || [];
        updates.push({
            id: new Date().getTime(),
            customerId: user.id,
            newName: document.getElementById('profName').value,
            newEmail: document.getElementById('profEmail').value,
            newPhone: document.getElementById('profPhone').value,
            newAddress: document.getElementById('profAddress').value,
            status: 'pending'
        });
        localStorage.setItem('profileUpdates', JSON.stringify(updates));
        showSuccess('Profile update request submitted to Employee for approval!');
        loadProfileUpdates(user.id);
    });

    // Loan Application
    document.getElementById('loanForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('loanType').value;
        const amt = document.getElementById('loanAmount').value;
        const interest = document.getElementById('loanInterest').value;
        const timeline = document.getElementById('loanTimeline').value;
        const docInput = document.getElementById('loanDoc');
        const docName = docInput.files.length > 0 ? docInput.files[0].name : 'None';
        const loans = JSON.parse(localStorage.getItem('loans')) || [];
        loans.push({
            id: new Date().getTime(),
            customerId: user.id,
            type: type,
            amount: amt,
            interest: interest,
            timeline: timeline,
            document: docName,
            status: 'pending_emp',
            appliedBy: user.username
        });
        localStorage.setItem('loans', JSON.stringify(loans));
        showSuccess('Loan application submitted for Employee Review!');
        loadLoans(user.id);
        document.getElementById('loanForm').reset();
    });

    // Money Transfer
    document.getElementById('transferForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const acc = document.getElementById('transferAcc').value;
        const ifsc = document.getElementById('transferIfsc').value;
        const amount = parseFloat(document.getElementById('transferAmount').value);
        
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIdx = users.findIndex(u => u.id === user.id);
        
        if (userIdx !== -1) {
            let currentBalance = parseFloat(users[userIdx].balance) || 0;
            if (currentBalance >= amount) {
                // Deduct Balance
                users[userIdx].balance = currentBalance - amount;
                localStorage.setItem('users', JSON.stringify(users));
                
                // Add Transaction
                let txs = JSON.parse(localStorage.getItem('transactions')) || [];
                txs.push({
                    id: new Date().getTime(),
                    customerId: user.id,
                    type: 'transfer_out',
                    amount: amount,
                    toAcc: acc,
                    ifsc: ifsc,
                    date: new Date().toISOString()
                });
                localStorage.setItem('transactions', JSON.stringify(txs));
                
                showSuccess(`Successfully transferred ₹${amount} to Account ${acc}`);
                // Refresh local user data
                localStorage.setItem('currentUser', JSON.stringify(users[userIdx]));
                document.getElementById('accBalance').innerText = `₹${users[userIdx].balance}`;
                document.getElementById('transferForm').reset();
                loadTransactions(user.id);
            } else {
                alert("Insufficient balance for this transfer!");
            }
        }
    });
});

function updateInterestRate() {
    const typeSelect = document.getElementById('loanType');
    const selectedOption = typeSelect.options[typeSelect.selectedIndex];
    if(selectedOption && selectedOption.dataset.rate) {
        document.getElementById('loanInterest').value = selectedOption.dataset.rate;
    }
}

function showSection(sectionId) {
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('profileSection').style.display = 'none';
    document.getElementById('transactionsSection').style.display = 'none';
    document.getElementById('transfersSection').style.display = 'none';
    document.getElementById('loansSection').style.display = 'none';
    document.getElementById('servicesSection').style.display = 'none';

    document.getElementById(sectionId + 'Section').style.display = 'block';

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => link.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function loadTransactions(customerId) {
    const txs = JSON.parse(localStorage.getItem('transactions')) || [];
    const userTxs = txs.filter(t => t.customerId === customerId);
    const tbody = document.getElementById('txBody');
    tbody.innerHTML = '';
    userTxs.forEach(tx => {
        tbody.innerHTML += `<tr><td>${tx.id}</td><td>${tx.type}</td><td>₹${tx.amount}</td><td>${new Date(tx.date).toLocaleString()}</td></tr>`;
    });
}

function loadLoans(customerId) {
    const loans = JSON.parse(localStorage.getItem('loans')) || [];
    const userLoans = loans.filter(l => l.customerId === customerId);
    const tbody = document.getElementById('myLoansBody');
    tbody.innerHTML = '';
    userLoans.forEach(l => {
        let badge = l.status === 'approved' ? 'success' : (l.status === 'rejected' ? 'danger' : 'warning');
        let statusDisplay = l.status.toUpperCase();
        if(l.status === 'pending_emp') statusDisplay = 'EMP REVIEW';
        if(l.status === 'pending') statusDisplay = 'ADMIN REVIEW';
        
        let actionBtn = (l.status === 'pending_emp' || l.status === 'pending') ? `<button class="btn btn-sm btn-danger" onclick="cancelLoanRequest(${l.id})">Cancel</button>` : `<span class="text-muted">-</span>`;
        
        tbody.innerHTML += `<tr>
            <td>${l.id}</td>
            <td>₹${l.amount}</td>
            <td><span class="badge bg-${badge}">${statusDisplay}</span></td>
            <td>${actionBtn}</td>
        </tr>`;
    });
}

function cancelLoanRequest(loanId) {
    showConfirm("Are you sure you want to cancel this loan application?", () => {
        let loans = JSON.parse(localStorage.getItem('loans')) || [];
        loans = loans.filter(l => l.id !== loanId);
        localStorage.setItem('loans', JSON.stringify(loans));
        const user = getCurrentUser();
        if(user) loadLoans(user.id);
    });
}

function loadProfileUpdates(customerId) {
    const updates = JSON.parse(localStorage.getItem('profileUpdates')) || [];
    const userUpdates = updates.filter(u => u.customerId === customerId);
    const tbody = document.getElementById('profileUpdatesBody');
    tbody.innerHTML = '';
    userUpdates.forEach(u => {
        let badge = u.status === 'approved' ? 'success' : (u.status === 'rejected' ? 'danger' : 'warning');
        tbody.innerHTML += `<tr><td>${u.id}</td><td><span class="badge bg-${badge}">${u.status}</span></td></tr>`;
    });
}

function applyForService(serviceType) {
    const user = getCurrentUser();
    if(!user) return;
    
    let services = JSON.parse(localStorage.getItem('serviceRequests')) || [];
    services.push({
        id: new Date().getTime(),
        customerId: user.id,
        serviceType: serviceType,
        status: 'pending',
        date: new Date().toISOString()
    });
    localStorage.setItem('serviceRequests', JSON.stringify(services));
    showSuccess(`${serviceType} application submitted successfully!`);
    loadServiceRequests(user.id);
}

function loadServiceRequests(customerId) {
    const services = JSON.parse(localStorage.getItem('serviceRequests')) || [];
    const userServices = services.filter(s => s.customerId === customerId);
    const tbody = document.getElementById('servicesBody');
    tbody.innerHTML = '';
    userServices.forEach(s => {
        let badge = s.status === 'approved' ? 'success' : (s.status === 'rejected' ? 'danger' : 'warning');
        let actionBtn = s.status === 'pending' ? `<button class="btn btn-sm btn-danger" onclick="cancelServiceRequest(${s.id})">Cancel</button>` : `<span class="text-muted">-</span>`;
        tbody.innerHTML += `<tr>
            <td>${s.id}</td>
            <td>${s.serviceType}</td>
            <td><span class="badge bg-${badge}">${s.status.toUpperCase()}</span></td>
            <td>${new Date(s.date).toLocaleDateString()}</td>
            <td>${actionBtn}</td>
        </tr>`;
    });
}

function cancelServiceRequest(requestId) {
    showConfirm("Are you sure you want to cancel this service request?", () => {
        let services = JSON.parse(localStorage.getItem('serviceRequests')) || [];
        services = services.filter(s => s.id !== requestId);
        localStorage.setItem('serviceRequests', JSON.stringify(services));
        const user = getCurrentUser();
        if(user) loadServiceRequests(user.id);
    });
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
