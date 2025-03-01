import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Brain, Terminal, Bot, Code, Mail, Video } from 'lucide-react';
import AdminRoutes from './Admin/index';

function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setLoading(false);
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/login');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const menuItems = [
    { path: '/admin', label: 'Gösterge Paneli', icon: Bot, exact: true },
    { path: '/admin/teacher', label: 'Öğretmen Bot', icon: Brain },
    { path: '/admin/windows', label: 'Windows Bot', icon: Terminal },
    { path: '/admin/kali', label: 'Kali Bot', icon: Bot },
    { path: '/admin/code', label: 'Kod Bot', icon: Code },
    { path: '/admin/emails', label: 'E-posta Yönetimi', icon: Mail },
    { path: '/admin/contents', label: 'İçerik Yönetimi', icon: Video }
  ];

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white">AI Asistan Paneli</h2>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 text-sm ${
                  (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path))
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <AdminRoutes />
      </main>
    </div>
  );
}

export default Admin;