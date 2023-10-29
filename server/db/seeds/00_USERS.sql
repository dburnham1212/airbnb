-- Insert base users into the "users" table (password: letmein)

-- User 1
INSERT INTO users (first_name, last_name, phone_number, email, password, role) 
VALUES ('Dylan', 'Burnham', '555-555-5555', 'dburnham1212@gmail.com', '$2a$12$vwfiBALtJBr07uHNM0y9UeRmOg.d4A4o0Mfqi0g3vxpZcFyQqPUly', 'admin');

-- User 2
INSERT INTO users (first_name, last_name, phone_number, email, password, role)
VALUES ('Test', 'Tester', '555-555-5555', 'test@gmail.com', '$2a$12$vwfiBALtJBr07uHNM0y9UeRmOg.d4A4o0Mfqi0g3vxpZcFyQqPUly', 'customer');

-- User 3
INSERT INTO users (first_name, last_name, phone_number, email, password, role)
VALUES ('Admin', 'Two', '555-555-5555', 'test2@gmail.com', '$2a$12$vwfiBALtJBr07uHNM0y9UeRmOg.d4A4o0Mfqi0g3vxpZcFyQqPUly', 'admin');