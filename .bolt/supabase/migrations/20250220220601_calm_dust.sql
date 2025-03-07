/*
  # Admin kullanıcısı oluşturma

  1. Yeni Kullanıcı
    - E-posta: admin@bebekorgudunyas.com
    - Şifre: admin123
    - Rol: admin

  2. Güvenlik
    - Kullanıcı admin rolüne atanır
    - E-posta doğrulaması otomatik olarak tamamlanır
*/

-- Admin kullanıcısı oluştur
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'admin',
  'admin@bebekorgudunyas.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);