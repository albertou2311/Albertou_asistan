import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Advertisement {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  active: boolean;
  created_at: string;
}

function AdvertisementsAdmin() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    active: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  async function fetchAdvertisements() {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdvertisements(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Reklamlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('advertisements')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          }
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('advertisements')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));
      setImageFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Görsel yüklenirken bir hata oluştu');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const adData = {
        title: formData.title,
        image_url: formData.image_url,
        link_url: formData.link_url || null,
        active: formData.active
      };

      if (selectedAd) {
        const { error } = await supabase
          .from('advertisements')
          .update(adData)
          .eq('id', selectedAd.id);

        if (error) throw error;
        toast.success('Reklam başarıyla güncellendi');
      } else {
        const { error } = await supabase
          .from('advertisements')
          .insert([adData]);

        if (error) throw error;
        toast.success('Reklam başarıyla eklendi');
      }

      setIsModalOpen(false);
      setSelectedAd(null);
      resetForm();
      fetchAdvertisements();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Bir hata oluştu');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Bu reklamı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Reklam başarıyla silindi');
      fetchAdvertisements();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Reklam silinirken bir hata oluştu');
    }
  }

  function resetForm() {
    setFormData({
      title: '',
      image_url: '',
      link_url: '',
      active: true
    });
  }

  function handleEdit(ad: Advertisement) {
    setSelectedAd(ad);
    setFormData({
      title: ad.title,
      image_url: ad.image_url,
      link_url: ad.link_url || '',
      active: ad.active
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
        <h2 className="text-2xl font-bold text-gray-900">Reklam Yönetimi</h2>
        <button
          onClick={() => {
            resetForm();
            setSelectedAd(null);
            setIsModalOpen(true);
          }}
          className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Yeni Reklam Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.map((ad) => (
          <div key={ad.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              {!ad.active && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Pasif</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
              {ad.link_url && (
                <a
                  href={ad.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline mt-1 block"
                >
                  {ad.link_url}
                </a>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(ad)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedAd ? 'Reklam Düzenle' : 'Yeni Reklam Ekle'}
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
                  <label className="block text-sm font-medium text-gray-700">Başlık</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bağlantı URL (İsteğe bağlı)</label>
                  <input
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Görsel</label>
                  {formData.image_url && (
                    <div className="mt-2 relative">
                      <img
                        src={formData.image_url}
                        alt="Reklam görseli"
                        className="h-48 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        handleImageUpload(file);
                      }
                    }}
                    className="mt-2"
                  />

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-pink-500 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                    Aktif
                  </label>
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
                    {selectedAd ? 'Güncelle' : 'Ekle'}
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

export default AdvertisementsAdmin;