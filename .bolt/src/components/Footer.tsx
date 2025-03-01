import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Twitter, Youtube, BookIcon as TiktokIcon, Linkedin, Pointer as Pinterest, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ContactForm from './ContactForm';

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

function Footer() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);

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
    <footer className="bg-white shadow-md mt-8">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* İletişim Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>Örnek Mahallesi, Örnek Sokak No:1, İstanbul</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+902125555555" className="hover:text-pink-500">
                  +90 (212) 555 55 55
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:info@bebekorgudunyas.com" className="hover:text-pink-500">
                  info@bebekorgudunyas.com
                </a>
              </div>
            </div>
          </div>

          {/* Hızlı Bağlantılar */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Bağlantılar</h3>
            <div className="space-y-2">
              <a href="/urunler" className="block text-gray-600 hover:text-pink-500">Tüm Ürünler</a>
              <a href="/urunler/elbise" className="block text-gray-600 hover:text-pink-500">Elbiseler</a>
              <a href="/urunler/patik" className="block text-gray-600 hover:text-pink-500">Patikler</a>
              <a href="/urunler/sapka" className="block text-gray-600 hover:text-pink-500">Şapkalar</a>
              <a href="/urunler/yelek" className="block text-gray-600 hover:text-pink-500">Yelekler</a>
            </div>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya</h3>
            <div className="flex flex-wrap gap-4">
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
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* İletişim Formu */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bize Ulaşın</h3>
            <button
              onClick={() => setShowContactForm(true)}
              className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors"
            >
              İletişim Formu
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-600 text-sm">
            © 2024 Bebek Örgü Dünyası. Tüm hakları saklıdır.
          </div>
        </div>
      </div>

      {/* Modal Contact Form */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Bize Ulaşın</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;