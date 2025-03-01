import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Advertisement {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
}

function Home() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  useEffect(() => {
    async function fetchAdvertisements() {
      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAdvertisements(data || []);
      } catch (error) {
        console.error('Error fetching advertisements:', error);
      }
    }

    fetchAdvertisements();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section with Carousel */}
      <section className="relative h-[500px] rounded-xl overflow-hidden">
        {advertisements.length > 0 ? (
          <div className="relative h-full">
            {advertisements.map((ad, index) => (
              <div
                key={ad.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === 0 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {ad.link_url ? (
                  <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ) : (
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9"
            alt="El Örgüsü Bebek Kıyafetleri"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              El Örgüsü Bebek Kıyafetleri
            </h1>
            <p className="text-xl mb-8">
              Sevgiyle örülen, özenle hazırlanan bebek kıyafetleri
            </p>
            <Link
              to="/urunler"
              className="bg-pink-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-pink-600 transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <CategoryCard
          title="Elbiseler"
          image="https://images.unsplash.com/photo-1522771930-78848d9293e8"
          path="/urunler/elbise"
        />
        <CategoryCard
          title="Patikler"
          image="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4"
          path="/urunler/patik"
        />
        <CategoryCard
          title="Şapkalar"
          image="https://images.unsplash.com/photo-1575428652377-a2d80e2277fc"
          path="/urunler/sapka"
        />
        <CategoryCard
          title="Takımlar"
          image="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af"
          path="/urunler/takim"
        />
      </section>
    </div>
  );
}

function CategoryCard({ title, image, path }: { title: string; image: string; path: string }) {
  return (
    <Link to={path} className="group">
      <div className="relative h-64 rounded-lg overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h3 className="text-white text-2xl font-semibold">{title}</h3>
        </div>
      </div>
    </Link>
  );
}

export default Home;