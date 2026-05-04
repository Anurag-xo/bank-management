document.addEventListener("DOMContentLoaded", () => {
    // Inject Top Navbar
    const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background-color: var(--primary); z-index: 1050; box-shadow: var(--shadow-sm);">
            <div class="container-fluid">
                <button class="btn btn-outline-light btn-sm me-3" onclick="window.history.back()" id="backBtn" title="Go Back">
                    <i class="bi bi-arrow-left"></i> Back
                </button>
                <a class="navbar-brand fw-bold text-white d-flex align-items-center gap-3" href="../landing/index.html">
                    <span style="font-size: 1.5rem; letter-spacing: -0.5px;">Sentinel Bank</span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="topNav">
                    <ul class="navbar-nav ms-auto" id="navLinks">
                        <!-- Dynamic Links -->
                    </ul>
                </div>
            </div>
        </nav>
        <div style="height: 60px;"></div> <!-- Spacer for fixed top nav -->
    `;

    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const navLinks = document.getElementById('navLinks');

    if (user) {
        navLinks.innerHTML = `
            <li class="nav-item">
                <span class="nav-link text-white me-3 d-flex align-items-center gap-2">
                   <i class="bi bi-person-circle"></i> ${user.name} (${user.role})
                </span>
            </li>
            <li class="nav-item d-flex align-items-center">
                <button class="btn btn-danger btn-sm" onclick="logout()"><i class="bi bi-box-arrow-right"></i> Logout</button>
            </li>
        `;
    } else {
        const currentPath = window.location.pathname;
        let linksHTML = '<li class="nav-item"><a class="nav-link text-white" href="../landing/index.html">Home</a></li>';

        if (!currentPath.includes('login.html')) {
            linksHTML += '<li class="nav-item"><a class="nav-link text-white" href="../login/login.html">Login</a></li>';
        }
        if (!currentPath.includes('register.html')) {
            linksHTML += '<li class="nav-item"><a class="nav-link text-white" href="../register/register.html">Register</a></li>';
        }

        navLinks.innerHTML = linksHTML;
    }
});
