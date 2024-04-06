CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1)
);

CREATE TABLE carts (
  username TEXT PRIMARY KEY REFERENCES users(username) ON DELETE CASCADE,
  products TEXT[],
  total NUMERIC(10,2) DEFAULT 0.00 CHECK (total >= 0)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
  products TEXT[] NOT NULL,
  total NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (total >= 0), 
  shipping_address TEXT NOT NULL,
  ordered_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

