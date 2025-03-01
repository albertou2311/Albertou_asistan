import React, { useState, useEffect } from 'react';
import { Video, Link as LinkIcon, Plus, Tag, Upload, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Content {
  id: string;
  title: string;
  type: 'video' | 'link';
  url: string;
  description: string;
  tags: string[];
  category: string;
  created_at: string;
}

function ContentManager() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'link'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'video' as const,
    url: '',
    description: '',
    tags: [] as string[],
    category: ''
  });

  useEffect(() => {
    fetchContents();
  }, []);

  async function fetchContents() {
    try {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('İçerikler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || content.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Video className="h-6 w-6" />
          İçerik Yönetimi
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Yeni İçerik Ekle
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="İçerik ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          className="bg-gray-800 border border-gray-700 rounded-md text-white px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tüm İçerikler</option>
          <option value="video">Videolar</option>
          <option value="link">Linkler</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContents.map(content => (
          <div key={content.id} className="bg-gray-800 rounded-lg overflow-hidden">
            {content.type === 'video' && (
              <div className="aspect-video bg-gray-900">
                <iframe
                  src={content.url}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">{content.title}</h3>
                {content.type === 'link' && (
                  <a
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <LinkIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-4">{content.description}</p>
              <div className="flex flex-wrap gap-2">
                {content.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-500 text-xs text-white rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                <span className="px-2 py-1 bg-gray-700 text-xs text-white rounded-full">
                  {content.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Yeni İçerik Ekle</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    İçerik Türü
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'video' | 'link' })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Etiketler
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-500 text-xs text-white rounded-full flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = [...formData.tags];
                            newTags.splice(index, 1);
                            setFormData({ ...formData, tags: newTags });
                          }}
                          className="text-white hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Etiket ekle..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value && !formData.tags.includes(value)) {
                            setFormData({
                              ...formData,
                              tags: [...formData.tags, value]
                            });
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                      className="flex-1 min-w-[100px] bg-gray-700 border border-gray-600 rounded-md text-white px-2 py-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Kaydet
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

export default ContentManager;