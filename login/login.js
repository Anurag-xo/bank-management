/* LOGIN PAGE JS */

var loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var empId = document.getElementById('loginEmpId').value.trim();
    var password = document.getElementById('loginPassword').value;

    if (empId === "" || password === "") {
        showToast('Please enter Employee ID and Password.', true);
        return;
    }

    // Save info
    localStorage.setItem('bms_empId', empId);
    localStorage.setItem('bms_empName', 'TCS Employee');
    localStorage.setItem('bms_empEmail', empId + '@tcsbank.com');

    // Show Bootstrap Modal
    var modalEl = document.getElementById('loginModal');
    var modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
});

function closeLoginModal() {
    window.location.href = '../dashboard/dashboard.html';
}
