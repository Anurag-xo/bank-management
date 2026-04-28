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

// Sidebar Dropdown Toggle Logic
document.addEventListener('DOMContentLoaded', function() {
    var dropdownLinks = document.querySelectorAll('.has-dropdown > a');
    
    // 1. Handle Click to Toggle
    dropdownLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Only prevent default if we want it to ONLY toggle
            // If the link has a real href, we might want to navigate
            // But usually dropdown parents in sidebars only toggle.
            e.preventDefault(); 
            var parent = this.parentElement;
            parent.classList.toggle('open');
            
            // Close others
            document.querySelectorAll('.has-dropdown').forEach(function(item) {
                if (item !== parent) item.classList.remove('open');
            });
        });
    });

    // 2. Auto-open dropdown if a child link is active or if parent is active
    var activeLink = document.querySelector('.nav-link.active, .dropdown-link.active');
    if (activeLink) {
        var parentDropdown = activeLink.closest('.has-dropdown');
        if (parentDropdown) {
            parentDropdown.classList.add('open');
        }
    }
});
