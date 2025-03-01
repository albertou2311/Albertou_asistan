import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasını doğru konumdan yükle
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Bot API Servisi
class BotAPI {
  // Ürün işlemleri
  async getProducts(category = null) {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Ürünler alınırken hata:', error);
      return [];
    }
  }

  async getProduct(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Ürün alınırken hata:', error);
      return null;
    }
  }

  // Mesaj işlemleri
  async saveMessage(name, message, platform) {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          name,
          email: `${platform}@bot.messages`,
          message,
          read: false
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Mesaj kaydedilirken hata:', error);
      return false;
    }
  }

  // Rapor işlemleri
  async getDailyReport() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Günlük mesaj sayısı
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('count')
        .gte('created_at', today.toISOString());

      if (messagesError) throw messagesError;

      // Günlük yorum sayısı
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('count')
        .gte('created_at', today.toISOString());

      if (commentsError) throw commentsError;

      // Stok durumu
      const { data: lowStock, error: stockError } = await supabase
        .from('products')
        .select('count')
        .lt('stock', 5);

      if (stockError) throw stockError;

      return {
        messages: messages[0]?.count || 0,
        comments: comments[0]?.count || 0,
        lowStock: lowStock[0]?.count || 0
      };
    } catch (error) {
      console.error('Rapor alınırken hata:', error);
      return null;
    }
  }
}

export const botAPI = new BotAPI();