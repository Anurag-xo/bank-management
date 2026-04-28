/* SHARED UTILITIES */

// Generate 7-digit ID
function generateEmployeeId() {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
}

// Simple Toast / Alert function (Bootstrap Compatible)
function showToast(message, isError) {
    var toastContainer = document.getElementById('toast');
    var toastBody = document.getElementById('toastBody');
    
    if (!toastContainer || !toastBody) {
        alert(message);
        return;
    }
    
    toastBody.textContent = message;
    
    // Change color based on error
    var toastEl = toastContainer.querySelector('.toast');
    if (isError) {
        toastEl.classList.remove('bg-dark');
        toastEl.classList.add('bg-danger');
    } else {
        toastEl.classList.remove('bg-danger');
        toastEl.classList.add('bg-dark');
    }
    
    toastContainer.style.display = 'block';
    
    setTimeout(function() {
        toastContainer.style.display = 'none';
    }, 3000);
}
