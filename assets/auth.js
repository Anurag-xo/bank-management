function initDummyData() {
    const defaultUsers = [
        { id: 1, role: 'admin', username: 'admin', password: 'password123', name: 'Super Admin', email: 'admin@sentinel.com', phone: '0000000000', address: 'HQ' },
        { id: 2, role: 'employee', username: 'emp1', password: 'password123', name: 'John Doe (Emp)', email: 'john@sentinel.com', phone: '1111111111', address: 'Branch 1' },
        { id: 21, role: 'employee', username: 'emp2', password: 'password123', name: 'Sarah Connor', email: 'sarah@sentinel.com', phone: '2222222222', address: 'Branch 2' },
        { id: 22, role: 'employee', username: 'emp3', password: 'password123', name: 'Michael Scott', email: 'michael@sentinel.com', phone: '3333333333', address: 'Branch 3' },
        { id: 3, role: 'customer', username: 'cust1', password: 'password123', name: 'Jane Smith', email: 'jane@example.com', phone: '9876543210', address: '123 Main St, City', balance: 50000, cibil: 750, status: 'active' },
        { id: 31, role: 'customer', username: 'cust2', password: 'password123', name: 'Bruce Wayne', email: 'bruce@wayne.com', phone: '9876543211', address: 'Wayne Manor', balance: 9500000, cibil: 850, status: 'active' },
        { id: 32, role: 'customer', username: 'cust3', password: 'password123', name: 'Clark Kent', email: 'clark@dailyplanet.com', phone: '9876543212', address: 'Metropolis', balance: 2500, cibil: 680, status: 'active' },
        { id: 33, role: 'customer', username: 'cust4', password: 'password123', name: 'Diana Prince', email: 'diana@amazon.com', phone: '9876543213', address: 'Themyscira', balance: 75000, cibil: 790, status: 'active' }
    ];

    let currentUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Add default users if they don't already exist by username
    defaultUsers.forEach(du => {
        if (!currentUsers.find(cu => cu.username === du.username)) {
            currentUsers.push(du);
        }
    });
    
    localStorage.setItem('users', JSON.stringify(currentUsers));
    if (!localStorage.getItem('loans')) {
        localStorage.setItem('loans', JSON.stringify([
            { id: 1, customerId: 3, amount: 100000, status: 'pending', appliedBy: 'cust1' }
        ]));
    }
    if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify([
            { id: 1, customerId: 3, amount: 5000, type: 'credit', date: new Date().toISOString() }
        ]));
    }
    if (!localStorage.getItem('profileUpdates')) {
        localStorage.setItem('profileUpdates', JSON.stringify([]));
    }
}
initDummyData();

function login(username, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
    return null;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../login/login.html';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function checkAccess(role) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '../login/login.html';
    } else if (user.role !== role) {
        window.location.href = `../${user.role}/${user.role}-dashboard.html`;
    }
}
