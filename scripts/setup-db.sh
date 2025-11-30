#!/bin/bash

# Playwright MCP Automation - Database Setup Script
# This script sets up the MySQL test database

set -e

DB_HOST=${1:-localhost}
DB_USER=${2:-root}
DB_PASSWORD=${3:-root}
DB_NAME="test_automation"

echo "🗄️  Setting up test database..."
echo "Host: $DB_HOST"
echo "User: $DB_USER"
echo ""

# Create database and tables
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
USE $DB_NAME;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  quantity INT DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  test_case_id VARCHAR(100),
  test_name VARCHAR(255),
  status VARCHAR(20),
  duration_ms INT,
  error_message TEXT,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (email, password, first_name, last_name, role, status)
VALUES 
  ('john@example.com', 'password123', 'John', 'Doe', 'user', 'active'),
  ('admin@example.com', 'admin123', 'Admin', 'User', 'admin', 'active'),
  ('jane@example.com', 'password456', 'Jane', 'Smith', 'user', 'active');

INSERT INTO products (name, description, price, quantity, sku, category, status)
VALUES
  ('Laptop', 'High performance laptop', 999.99, 50, 'LAPTOP-001', 'Electronics', 'available'),
  ('Mouse', 'Wireless mouse', 29.99, 200, 'MOUSE-001', 'Accessories', 'available'),
  ('Keyboard', 'Mechanical keyboard', 129.99, 100, 'KEYBOARD-001', 'Accessories', 'available');

EOF

echo "✅ Database setup complete!"
echo ""
echo "📝 Update .env with:"
echo "DB_HOST=$DB_HOST"
echo "DB_USER=$DB_USER"
echo "DB_NAME=$DB_NAME"
echo ""
