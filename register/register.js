/* =============================================
   REGISTER PAGE JavaScript (register.html)
   ============================================= */

// Get form elements
var empIdField = document.getElementById('empId');
var registerForm = document.getElementById('registerForm');
var successMessage = document.getElementById('successMessage');

// Auto-generate Employee ID on page load
empIdField.value = generateEmployeeId();

// Handle registration form submission
registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var address = document.getElementById('address').value.trim();
    var contact = document.getElementById('contact').value.trim();

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !address || !contact) {
        showToast('Please fill in all fields.', true);
        return;
    }

    // Validate password match
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', true);
        return;
    }

    // Validate contact number (10 digits)
    if (contact.length !== 10 || isNaN(contact)) {
        showToast('Contact number must be exactly 10 digits.', true);
        return;
    }

    // Save employee info to localStorage
    localStorage.setItem('bms_empId', empIdField.value);
    localStorage.setItem('bms_empName', firstName + ' ' + lastName);
    localStorage.setItem('bms_empEmail', email);

    showToast('TCS Bank registration successful! Redirecting...', false);

    // Redirect to dashboard
    setTimeout(function() {
        window.location.href = '../dashboard/dashboard.html';
    }, 1000);
});
