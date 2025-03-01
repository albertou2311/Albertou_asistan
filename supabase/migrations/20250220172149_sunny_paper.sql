/*
  # Add comments and messages tables

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `name` (text)
      - `email` (text)
      - `comment` (text)
      - `rating` (integer)
      - `approved` (boolean)
      - `created_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public and admin access
*/

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  comment text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for comments
CREATE POLICY "Allow public read access to approved comments" ON comments
  FOR SELECT
  USING (approved = true);

CREATE POLICY "Allow admin full access to comments" ON comments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email'));

-- Policies for messages
CREATE POLICY "Allow public insert access to messages" ON messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin full access to messages" ON messages
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email'));