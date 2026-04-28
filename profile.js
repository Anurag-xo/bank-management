/* SIMPLE PROFILE SCRIPT */
// Load profile from localStorage
var empName = localStorage.getItem('bms_empName') || 'Employee';
var empId = localStorage.getItem('bms_empId') || '0000000';

// Populate simple name and ID
var userNameEl = document.getElementById('userName');
if (userNameEl) {
    userNameEl.textContent = empName;
}

var userIdEl = document.getElementById('userId');
if (userIdEl) {
    userIdEl.textContent = empId;
}
