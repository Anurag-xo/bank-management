CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    balance DOUBLE DEFAULT 0.0,
    cibil INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    type VARCHAR(50) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    to_acc VARCHAR(50),
    ifsc VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS loans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    type VARCHAR(100),
    amount DOUBLE NOT NULL,
    interest VARCHAR(10),
    timeline VARCHAR(10),
    document VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    applied_by VARCHAR(100),
    reviewed_by VARCHAR(100),
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS profile_updates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    new_name VARCHAR(100),
    new_email VARCHAR(100),
    new_phone VARCHAR(20),
    new_address VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS service_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS beneficiaries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    ifsc VARCHAR(50),
    status VARCHAR(50) DEFAULT 'verified',
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    card_number VARCHAR(20) NOT NULL,
    card_holder VARCHAR(100) NOT NULL,
    expiry VARCHAR(10) NOT NULL,
    cvv VARCHAR(3) NOT NULL,
    type VARCHAR(20) DEFAULT 'Debit',
    status VARCHAR(50) DEFAULT 'active',
    daily_limit DOUBLE DEFAULT 50000.0,
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    performed_by VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert a default manager for testing
INSERT INTO users (role, username, password, name, email) 
SELECT 'manager', 'manager', 'password123', 'Manager', 'manager@sentinel.com'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'manager');
