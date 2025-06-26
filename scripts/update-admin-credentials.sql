-- Update admin credentials
UPDATE employees 
SET 
  employee_id = 'admin1',
  password = 'Babaisona@201223#$'
WHERE employee_id = 'Admin';

-- Create accounts table for managing all user accounts
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  account_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('admin', 'employee', 'client')),
  role VARCHAR(100),
  department VARCHAR(100),
  can_access_uptodate BOOLEAN DEFAULT false,
  industry VARCHAR(100),
  portfolio_value DECIMAL(15,2),
  risk_profile VARCHAR(50),
  account_manager_id VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create completed_clients table for admin to view all completed interactions
CREATE TABLE IF NOT EXISTS completed_clients (
  id SERIAL PRIMARY KEY,
  original_entry_id INTEGER NOT NULL,
  serial_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  employee_id VARCHAR(50) NOT NULL,
  employee_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  completion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert existing admin into accounts table
INSERT INTO accounts (
  account_id, name, email, mobile_number, password, account_type, 
  role, department, can_access_uptodate
) VALUES (
  'admin1', 'Administrator', 'admin@fintechsolutions.com', '+1-555-0001', 
  'Babaisona@201223#$', 'admin', 'System Administrator', 'Management', true
) ON CONFLICT (account_id) DO UPDATE SET
  password = EXCLUDED.password,
  account_id = EXCLUDED.account_id;

-- Insert existing employees into accounts table
INSERT INTO accounts (
  account_id, name, email, mobile_number, password, account_type, 
  role, department, can_access_uptodate
)
SELECT 
  employee_id, name, email, mobile_number, password, 'employee',
  role, department, can_access_uptodate
FROM employees
WHERE employee_id != 'admin1'
ON CONFLICT (account_id) DO NOTHING;
