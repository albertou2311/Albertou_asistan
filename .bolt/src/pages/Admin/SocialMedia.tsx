import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  created_at: string;
}

const PLATFORMS = [
  'facebook',
  'instagram',
  'twitter',
  'youtube',
  'tiktok',
  'pinterest',
  'linkedin'
];

function SocialMediaAdmin() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SocialMedia | null>(null);
  const [formData, setFormData] = useState({
    platform: 'facebook',
    url: ''
  });

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  async function fetchSocialMedia() {
    try {
      const { data, error } = await supabase
        .from('social_media')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSocialMedia(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Sosyal medya bağlantıları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (selectedItem) {
        const { error } = await supabase
          .from('social_media')
          .update(formData)
          .eq('id', selectedItem.id);

        if (error) throw error;
        toast.success('Sosyal medya bağlantısı güncellendi');
      } else {
        const { error } = await supabase
          .from('social_media')
          .insert([formData]);

        if (error) throw error;
        toast.success('Sosyal medya bağlantısı eklendi');
      }

      setIsModalOpen(false);
      setSelectedItem(null);
      resetForm();
      fetchSocialMedia();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Bir hata oluştu');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Bu sosyal medya bağlantısını silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('social_media')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Sosyal medya bağlantısı silindi');
      fetchSocialMedia();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Sosyal medya bağlantısı silinirken bir hata oluştu');
    }
  }

  function resetForm() {
    setFormData({
      platform: 'facebook',
      url: ''
    });
  }

  function handleEdit(item: SocialMedia) {
    setSelectedItem(item);
    setFormData({
      platform: item.platform,
      url: item.url
    });
    setIsModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sosyal Medya Yönetimi</h2>
        <button
          onClick={() => {
            resetForm();
            setSelectedItem(null);
            setIsModalOpen(true);
          }}
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Yeni Bağlantı Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialMedia.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{item.platform}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline break-all"
            >
              {item.url}
            </a>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedItem ? 'Sosyal Medya Düzenle' : 'Yeni Sosyal Medya Ekle'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-200"
                  >
                    {PLATFORMS.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-200"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
                  >
                    {selectedItem ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocialMediaAdmin;