import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, Package, School as Spool } from 'lucide-react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import ProductComments from '../components/ProductComments';

function Products() {
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (category) {
          query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        {category 
          ? `${category.charAt(0).toUpperCase() + category.slice(1)}ler`
          : 'Tüm Ürünler'}
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Bu kategoride henüz ürün bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-square relative group">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/400?text=Ürün+Görseli'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Stokta Yok</span>
                  </div>
                )}
                {product.images.length > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {product.images.map((_, index) => (
                      <div
                        key={index}
                        className="w-2 h-2 rounded-full bg-white opacity-75"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Spool className="h-4 w-4" />
                    <span className="text-sm">
                      İp Markası: {product.yarn_brand || 'Himalaya'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">
                      İp Cinsi: {product.yarn_type || 'Pamuklu Baby Wool'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Özellikler:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {product.specifications ? (
                      product.specifications.map((spec, index) => (
                        <li key={index}>{spec}</li>
                      ))
                    ) : (
                      <>
                        <li>%100 El Yapımı</li>
                        <li>Antibakteriyel İp</li>
                        <li>Bebeğinizin Cildine Uygun</li>
                        <li>30 Derecede Yıkanabilir</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-pink-600">
                        {product.price.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY'
                        })}
                      </span>
                      {product.stock > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          (Stokta {product.stock} adet)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Yorumlar
                    </button>
                  </div>
                </div>

                {selectedProduct === product.id && (
                  <div className="mt-6 border-t pt-4">
                    <ProductComments productId={product.id} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;