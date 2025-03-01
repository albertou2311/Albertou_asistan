/*
  # Update admin policies

  1. Changes
    - Add admin role to auth.users
    - Update RLS policies for admin access
*/

-- Create admin role
CREATE ROLE admin;

-- Update admin user role
UPDATE auth.users
SET role = 'admin'
WHERE email = 'admin@bebekorgudunyas.com';

-- Update RLS policies for products
DROP POLICY IF EXISTS "Allow admin full access" ON products;
CREATE POLICY "Allow admin full access" ON products
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Update RLS policies for social_media
DROP POLICY IF EXISTS "Allow admin full access" ON social_media;
CREATE POLICY "Allow admin full access" ON social_media
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Update RLS policies for advertisements
DROP POLICY IF EXISTS "Allow admin full access" ON advertisements;
CREATE POLICY "Allow admin full access" ON advertisements
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Update RLS policies for comments
DROP POLICY IF EXISTS "Allow admin full access to comments" ON comments;
CREATE POLICY "Allow admin full access to comments" ON comments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Update RLS policies for messages
DROP POLICY IF EXISTS "Allow admin full access to messages" ON messages;
CREATE POLICY "Allow admin full access to messages" ON messages
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');