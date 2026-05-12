# Technical Specification: Sentinel Bank

## Tech Stack

### **Frontend**
*   **Framework**: Angular 17 (Standalone Components)
*   **Language**: TypeScript
*   **Styling**: Vanilla CSS (Premium Custom Design System)
*   **Icons**: Bootstrap Icons
*   **State Management**: RxJS & Reactive Services

### **Backend**
*   **Framework**: Spring Boot 3
*   **Language**: Java 17
*   **Database**: H2 (In-memory, persistent via schema.sql)
*   **Persistence**: Spring JDBC Template
*   **API**: RESTful Web Services

## Technical Architecture

### **1. Database Schema**
The system uses a relational model with the following core entities:
*   `users`: Stores credentials, roles (manager/employee/customer), and profile info.
*   `transactions`: Immutable ledger of all financial movements.
*   `loans`: Tracks loan applications, interest rates, and status.
*   `beneficiaries`: Stores trusted payees for customers.
*   `cards`: Manages digital card properties and limits.
*   `audit_logs`: Tracks administrative actions for compliance.
*   `notifications`: Stores persistent alerts for all users.

### **2. Security & Authentication**
*   **ID Generation**: Unique, role-prefixed IDs (CUST/EMP/MGR) are generated server-side using a collision-resistant random algorithm.
*   **Auth Guard**: Angular Route Guards prevent unauthorized access to role-specific dashboards.
*   **Data Masking**: Virtual cards and account numbers follow industry-standard masking formats in the UI.

### **3. Key Functional Modules**
*   **Financial Engine**: Backend logic handles atomic updates to balances ensuring money is never "lost" during transfers.
*   **EMI Calculator**: Frontend reactive logic using the standard PMT formula for real-time financial simulation.
*   **Notification Engine**: A shared service that aggregates alerts across the application with persistent state.
*   **Audit Tracking**: Trigger-based or service-level logging for all Managerial approvals.

## Installation & Setup

### **Prerequisites**
*   Node.js (LTS) & Angular CLI
*   Java JDK 17
*   Maven

### **Running the Application**
1.  **Backend**:
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```
2.  **Frontend**:
    ```bash
    npm install
    npm start
    ```
