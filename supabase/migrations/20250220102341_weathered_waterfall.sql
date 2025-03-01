/*
  # Initial Schema Setup

  1. Tables
    - products
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - category (text)
      - images (text array)
      - stock (integer)
      - created_at (timestamp)
    
    - social_media
      - id (uuid, primary key)
      - platform (text)
      - url (text)
      - created_at (timestamp)
    
    - advertisements
      - id (uuid, primary key)
      - title (text)
      - image_url (text)
      - link_url (text)
      - active (boolean)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Social media links table
CREATE TABLE IF NOT EXISTS social_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  link_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON products
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email'));

-- Policies for social media
CREATE POLICY "Allow public read access" ON social_media
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON social_media
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email'));

-- Policies for advertisements
CREATE POLICY "Allow public read access" ON advertisements
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON advertisements
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email'));