import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Archive, Tag, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Email {
  id: string;
  subject: string;
  content: string;
  to: string[];
  from: string;
  status: 'draft' | 'sent' | 'archived';
  created_at: string;
  tags: string[];
}

function EmailManager() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'sent' | 'draft' | 'archived'>('all');

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    try {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('E-postalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || email.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="h-6 w-6" />
          E-posta Yönetimi
        </h2>
        <button
          onClick={() => setSelectedEmail(null)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Yeni E-posta
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="E-posta ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="bg-gray-800 border border-gray-700 rounded-md text-white px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tümü</option>
          <option value="sent">Gönderilen</option>
          <option value="draft">Taslak</option>
          <option value="archived">Arşivlenen</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredEmails.map(email => (
          <div
            key={email.id}
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => setSelectedEmail(email)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">{email.subject}</h3>
              <div className="flex items-center gap-2">
                {email.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-500 text-xs text-white rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  email.status === 'sent' ? 'bg-green-500' :
                  email.status === 'draft' ? 'bg-yellow-500' :
                  'bg-gray-500'
                } text-white`}>
                  {email.status === 'sent' ? 'Gönderildi' :
                   email.status === 'draft' ? 'Taslak' :
                   'Arşivlendi'}
                </span>
              </div>
            </div>
            <p className="text-gray-400 mt-2 line-clamp-2">{email.content}</p>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
              <span>{new Date(email.created_at).toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Archive email
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <Archive className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Delete email
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmailManager;