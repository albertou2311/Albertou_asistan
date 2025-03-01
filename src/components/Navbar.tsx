import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Baby, ShoppingBag, Facebook, Instagram, Twitter, Youtube, BookIcon as TiktokIcon, Linkedin, Pointer as Pinterest } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SocialMedia {
  platform: string;
  url: string;
}

const ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: TiktokIcon,
  linkedin: Linkedin,
  pinterest: Pinterest
};

const categories = [
  { name: 'Elbiseler', path: '/urunler/elbise' },
  { name: 'Patikler', path: '/urunler/patik' },
  { name: 'Şapkalar', path: '/urunler/sapka' },
  { name: 'Yelekler', path: '/urunler/yelek' },
  { name: 'Kazaklar', path: '/urunler/kazak' },
  { name: 'Takımlar', path: '/urunler/takim' },
  { name: 'Bluzlar', path: '/urunler/bluz' },
  { name: 'Çantalar', path: '/urunler/canta' },
];

function Navbar() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);

  useEffect(() => {
    async function fetchSocialMedia() {
      try {
        const { data } = await supabase
          .from('social_media')
          .select('platform, url');
        
        if (data) {
          setSocialMedia(data);
        }
      } catch (error) {
        console.error('Error fetching social media:', error);
      }
    }

    fetchSocialMedia();
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        {/* Top Bar with Social Media */}
        <div className="py-2 border-b flex justify-end space-x-4">
          {socialMedia.map((item) => {
            const Icon = ICONS[item.platform as keyof typeof ICONS];
            return (
              <a
                key={item.platform}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>

        {/* Main Navigation */}
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Baby className="h-8 w-8 text-pink-500" />
            <span className="text-xl font-semibold text-gray-800">Bebek Örgü Dünyası</span>
          </Link>
          
          <div className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="text-gray-600 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/sepet" className="text-gray-600 hover:text-pink-500">
              <ShoppingBag className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;