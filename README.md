# Sentinel Bank Management System

## Project Overview
Sentinel Bank is a comprehensive, full-stack banking application designed to provide a modern, secure, and seamless banking experience for three distinct user roles: **Customers**, **Employees**, and **Managers**. 

The system moves beyond simple transactions, offering an enterprise-grade suite of features including loan management, card control, and real-time notifications.

## User Roles & Flow

### 1. Customer Flow
*   **Onboarding**: Users register with their personal details. The system automatically generates a unique **Customer ID** (e.g., CUST123456) for secure login.
*   **Financial Management**: Once logged in, customers can view their real-time balance, transfer funds to other accounts, and manage beneficiaries.
*   **Card Control**: Customers have access to a virtual card hub where they can set daily transaction limits or instantly block a card if stolen.
*   **Loan Lifecycle**: Users can use an interactive EMI calculator to simulate loan scenarios before applying. Once applied, they can track the approval status in real-time.
*   **Account Maintenance**: Customers can submit profile update requests and upload KYC documents for verification.

### 2. Employee Flow
*   **Customer Support**: Employees act as the bridge between the bank and the customer. They can create new customer accounts and process manual deposits/withdrawals.
*   **Loan Processing**: Employees initiate loan applications on behalf of customers and perform initial document checks.
*   **Profile Management**: Employees review profile update requests submitted by customers and either approve or reject them based on bank policies.

### 3. Manager Flow
*   **Executive Oversight**: Managers (Admins) have the highest level of authority. They manage the employee workforce and oversee the entire customer base.
*   **Final Approvals**: All loan applications initiated by employees must be reviewed and approved by a Manager before funds are disbursed.
*   **System Integrity**: Managers have access to **Audit Logs**, which track every critical action performed in the system (who approved which loan, who created which user, etc.), ensuring complete transparency.

## Business Logic Highlights
*   **Automated Accounting**: Every transaction (transfer, loan disbursement) automatically updates the relevant customer balances and creates a permanent record.
*   **Real-Time Alerts**: A global notification system keeps all users informed about account activities, loan statuses, and security alerts.
*   **Unified UI**: A consistent, premium design language is maintained across all dashboards, featuring a top navigation bar for profile management and a dedicated sidebar for role-specific actions.
