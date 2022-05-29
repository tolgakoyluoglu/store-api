CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR (255) NOT NULL UNIQUE,
  password VARCHAR (255),
  firstname VARCHAR (255),
  lastname VARCHAR (255),
  billing_adress VARCHAR (255),
  shipping_adress VARCHAR (255),
  country VARCHAR (255),
  phone INTEGER,
  sessions text[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id VARCHAR (255) NOT NULL,
  name VARCHAR (255) NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  stock INTEGER NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_categories (
  product_id VARCHAR(255) NOT NULL,
  category_id VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description VARCHAR(255),
  thumbnail TEXT,
  parent_id UUID DEFAULT NULL,
  name VARCHAR (255) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id VARCHAR (255) NOT NULL,
  amount DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  order_status VARCHAR (255) NOT NULL
);