document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        window.location.href = `../${user.role}/${user.role}-dashboard.html`;
    }

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const userVal = document.getElementById('username').value;
        const passVal = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');

        const loggedInUser = login(userVal, passVal);
        if (loggedInUser) {
            window.location.href = `../${loggedInUser.role}/${loggedInUser.role}-dashboard.html`;
        } else {
            errorMsg.style.display = 'block';
        }
    });
});
