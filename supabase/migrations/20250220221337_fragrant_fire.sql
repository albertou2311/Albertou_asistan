/*
  # Admin kullanıcı bilgilerini güncelleme

  1. Değişiklikler
    - E-posta: admin@albertouasistan.com
    - Şifre: Albertou2311.!@
    - Rol: admin (değişmedi)

  2. Güvenlik
    - Mevcut admin kullanıcısının bilgileri güncellenir
    - Rol ve yetkiler korunur
*/

-- Admin kullanıcısının bilgilerini güncelle
UPDATE auth.users
SET 
  email = 'admin@albertouasistan.com',
  encrypted_password = crypt('Albertou2311.!@', gen_salt('bf')),
  updated_at = now()
WHERE role = 'admin';