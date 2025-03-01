import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  name: string;
  comment: string;
  rating: number;
  created_at: string;
}

interface ProductCommentsProps {
  productId: string;
}

function ProductComments({ productId }: ProductCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    rating: 5
  });

  useEffect(() => {
    fetchComments();
  }, [productId]);

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('product_id', productId)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Yorumlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            product_id: productId,
            name: formData.name,
            email: formData.email,
            comment: formData.comment,
            rating: formData.rating
          }
        ]);

      if (error) throw error;

      toast.success('Yorumunuz başarıyla gönderildi ve onay bekliyor');
      setFormData({ name: '', email: '', comment: '', rating: 5 });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Yorum gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Yorum Yap</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adınız
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Puanınız
            </label>
            <div className="flex items-center space-x-2 mt-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className={`p-2 rounded-full ${
                    formData.rating === rating
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Yorumunuz
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Gönderiliyor...' : 'Yorum Gönder'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Yorumlar</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">Henüz yorum yapılmamış.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{comment.name}</span>
                <div className="flex">
                  {Array.from({ length: comment.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{comment.comment}</p>
              <span className="text-sm text-gray-400 mt-2 block">
                {new Date(comment.created_at).toLocaleDateString('tr-TR')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductComments;