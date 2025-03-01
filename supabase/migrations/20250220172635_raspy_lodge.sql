/*
  # Add sample products

  1. Sample Data
    - Adds 20 sample products across different categories
    - Each product has a name, description, price, and category
    - Uses realistic placeholder images from Unsplash
*/

-- Insert sample products
INSERT INTO products (name, description, price, category, images, stock) VALUES
-- Elbiseler
('Pembe Örgü Elbise', 'El yapımı, yumuşak pamuklu ipten örülmüş bebek elbisesi', 249.99, 'elbise', ARRAY['https://images.unsplash.com/photo-1522771930-78848d9293e8'], 10),
('Beyaz Dantel Elbise', 'Özel günler için dantel detaylı bebek elbisesi', 299.99, 'elbise', ARRAY['https://images.unsplash.com/photo-1518831959646-742c3a14ebf7'], 8),
('Renkli Çiçekli Elbise', 'Renkli çiçek desenleriyle süslenmiş örgü elbise', 279.99, 'elbise', ARRAY['https://images.unsplash.com/photo-1544413660-299165566b1d'], 15),
('Kış Örgü Elbise', 'Kalın ve sıcak tutan kışlık örgü elbise', 349.99, 'elbise', ARRAY['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2'], 12),

-- Patikler
('Klasik Bebek Patiği', 'Yumuşak ve rahat klasik model bebek patiği', 79.99, 'patik', ARRAY['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4'], 20),
('Ayıcıklı Patik', 'Sevimli ayıcık desenli bebek patiği', 89.99, 'patik', ARRAY['https://images.unsplash.com/photo-1473946877452-57aab53a43f8'], 15),
('Çiçekli Patik', 'Renkli çiçek işlemeli bebek patiği', 94.99, 'patik', ARRAY['https://images.unsplash.com/photo-1516962080544-eac695c93791'], 18),
('Kışlık Patik', 'Yünlü ve sıcak tutan kışlık bebek patiği', 99.99, 'patik', ARRAY['https://images.unsplash.com/photo-1511556820780-d912e42b4980'], 25),

-- Şapkalar
('Ponponlu Bere', 'Ponpon detaylı sevimli bebek beresi', 69.99, 'sapka', ARRAY['https://images.unsplash.com/photo-1575428652377-a2d80e2277fc'], 30),
('Kulaklı Şapka', 'Hayvan kulakları detaylı bebek şapkası', 79.99, 'sapka', ARRAY['https://images.unsplash.com/photo-1511556820780-d912e42b4980'], 20),
('Mevsimlik Şapka', 'Her mevsim kullanılabilen bebek şapkası', 74.99, 'sapka', ARRAY['https://images.unsplash.com/photo-1520013225692-fff4010c0ae4'], 25),

-- Yelekler
('Düğmeli Yelek', 'Klasik model düğmeli bebek yeleği', 129.99, 'yelek', ARRAY['https://images.unsplash.com/photo-1490481651871-ab68de25d43d'], 15),
('Desenli Yelek', 'Geometrik desenli şık bebek yeleği', 149.99, 'yelek', ARRAY['https://images.unsplash.com/photo-1434389677669-e08b4cac3105'], 12),

-- Kazaklar
('Boğazlı Kazak', 'Yumuşak ve sıcak tutan boğazlı bebek kazağı', 189.99, 'kazak', ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27'], 10),
('Desenli Kazak', 'Sevimli hayvan desenleriyle süslü kazak', 199.99, 'kazak', ARRAY['https://images.unsplash.com/photo-1559582798-678dfc71ccd8'], 8),

-- Takımlar
('Örgü Takım', 'Şapka, yelek ve patik takımı', 299.99, 'takim', ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'], 5),
('Kış Takımı', 'Kazak, bere ve patik takımı', 349.99, 'takim', ARRAY['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4'], 7),

-- Bluzlar
('Dantelli Bluz', 'Dantel detaylı şık bebek bluzu', 159.99, 'bluz', ARRAY['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2'], 15),
('Çiçekli Bluz', 'Renkli çiçek işlemeli bluz', 169.99, 'bluz', ARRAY['https://images.unsplash.com/photo-1544413660-299165566b1d'], 12),

-- Çantalar
('Örgü Çanta', 'El yapımı örgü bebek çantası', 119.99, 'canta', ARRAY['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d'], 20),
('Desenli Çanta', 'Renkli desenlerle süslü bebek çantası', 129.99, 'canta', ARRAY['https://images.unsplash.com/photo-1591561954557-26941169b49e'], 18);