document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const address = document.getElementById('regAddress').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        const errorMsg = document.getElementById('regError');

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const exists = users.find(u => u.username === username);

        if (exists) {
            errorMsg.style.display = 'block';
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

        // Basic default fields for customer
        if (role === 'customer') {
            newUser.balance = 0;
            newUser.cibil = Math.floor(Math.random() * (850 - 300 + 1)) + 300; // Random CIBIL 300-850
            newUser.status = 'active'; 
        }

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! Please login.');
        window.location.href = '../login/login.html';
    });
});
