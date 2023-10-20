DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS role_enum CASCADE;

CREATE TYPE role_enum AS ENUM('user', 'admin');

-- CREATE USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role role_enum NOT NULL
);