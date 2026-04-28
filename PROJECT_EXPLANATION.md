# TCS Bank Management System - Project Explanation

This document provides a line-by-line explanation of the portal's code to help you present it to your Lead.

---

## 1. Global Concepts (The "Foundation")

### Bootstrap 5 Usage
We use Bootstrap 5 to ensure the project looks professional and follows industry standards without writing thousands of lines of custom CSS.
*   **Grid System (`row`, `col-md-6`)**: Used to align elements side-by-side (like First Name and Last Name) and make the site responsive.
*   **Form Controls (`form-control`, `form-select`)**: These automatically style inputs and dropdowns to look clean and modern.
*   **Buttons (`btn btn-primary`, `btn-success`)**: Standardized button colors (Blue for primary actions, Green for success, Red for danger).
*   **Shadows (`shadow-sm`)**: Adds a subtle depth to boxes so they don't look "flat."

### Shared Layout (`shared-style.css`)
To keep the code clean and avoid repetition, we moved the core layout to this file.
*   **`display: flex` on `body`**: This allows the Sidebar and the Main Content to sit side-by-side.
*   **`.sidebar`**: Fixed to the left with a dark background (`#212529`). It uses `position: fixed` so it stays in place when the user scrolls.
*   **`.main-content`**: Has a `margin-left: 240px` to make room for the sidebar.
*   **`.header`**: The white bar at the top that shows the Page Title and User Profile.

---

## 2. Page-by-Page Explanation

### A. Landing Page (`index.html` & `landing.css`)
*   **Purpose**: The "Front Door" of the bank.
*   **HTML**: Uses `<nav>` for the top menu and `<section>` tags to separate the Hero, Services, and About areas.
*   **Connections**: The "Login" and "Register" buttons link to `login.html` and `register.html`.
*   **Logic**: No complex JavaScript here; it's purely informational.

### B. Login Page (`login.html` & `login.js`)
*   **Purpose**: To verify employees before they enter the system.
*   **HTML**: A centered `.login-box` containing a `<form>`.
*   **CSS**: Uses `flexbox` on the `body` to perfectly center the box on the screen.
*   **JavaScript (`login.js`)**: 
    1.  `e.preventDefault()`: Stops the page from refreshing when you click Login.
    2.  `localStorage.setItem()`: Saves the Employee ID so the Dashboard can show it later.
    3.  `new bootstrap.Modal()`: This is the Bootstrap command to pop up the "Success!" message.

### C. Registration Page (`register.html` & `register.js`)
*   **Purpose**: For new employees to create an account.
*   **Logic**: 
    1.  `generateEmployeeId()`: Automatically creates a random 7-digit ID for the new user.
    2.  **Validation**: The script checks if passwords match and if the contact number is 10 digits before saving.
    3.  **Redirection**: Once registered, it takes the user directly to the Dashboard.

### D. Dashboard (`dashboard.html` & `dashboard.css`)
*   **Purpose**: The central hub showing bank totals.
*   **Stats Cards**: We use `.stat-box` with Bootstrap background colors (`bg-primary`, `bg-success`).
*   **JavaScript**: A simple script shows today's date using `new Date().toDateString()`.
*   **Profile Info**: `profile.js` runs automatically to pull the Name and ID you entered during login/registration from the browser's memory (`localStorage`).

### E. Customer Management (`customer.html` & `customer.js`)
*   **Purpose**: To Add, Edit, or Delete customer records.
*   **HTML**: A large form inside a `.content-box`.
*   **JavaScript (`customer.js`)**: 
    *   It handles 3 different actions: **Add**, **Edit**, and **Delete**. 
    *   Currently, it shows a "Toast" (a small popup) to confirm the action happened successfully.

### F. Transaction Processing (`transaction.html` & `transaction.js`)
*   **Purpose**: To record deposits or withdrawals.
*   **Logic**: The user selects a "Type" (Deposit/Withdrawal). The script validates that an amount is entered and then shows a confirmation message.

### G. Loan Management (`loan.html` & `loan.js`)
*   **Purpose**: To handle loan applications.
*   **Logic**: Similar to the Customer page, but focused on financial requests. It allows the employee to Apply, Update, or Cancel a loan request.

---

## 3. Utility Scripts

### `script.js` (The Toast System)
This file contains the `showToast(message, isError)` function used by **every** page. 
*   It finds the `#toast` div in the HTML.
*   Changes the color (Red for errors, Dark for success).
*   Changes `display: none` to `display: block` to show it.
*   Uses `setTimeout` to automatically hide it after 3 seconds.

### `profile.js` (The Session System)
This script ensures that the Name and ID at the top right of the screen are always correct.
*   It reads `bms_empName` and `bms_empId` from `localStorage`.
*   If found, it puts that text into the HTML spans `userName` and `userId`.

---

## 4. How Pages are Connected
1.  **Index** → Login or Register.
2.  **Login/Register** → Saves data to `localStorage` → Redirects to Dashboard.
3.  **Internal Pages** (Dashboard, Customer, etc.) → Linked via the **Sidebar**.
4.  **Logout** → Clears no data but redirects back to **Index.html**.
