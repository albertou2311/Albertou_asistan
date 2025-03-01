import React, { useState, useEffect } from 'react';
import { Layout } from 'lucide-react';
import BaseMonitor from './BaseMonitor';

interface PageMonitorProps {
  title: string;
  logs: string[];
  onClose: () => void;
}

function PageMonitor({ title, logs, onClose }: PageMonitorProps) {
  const [currentPage, setCurrentPage] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const pages = [
        'https://example.com/dashboard',
        'https://example.com/users',
        'https://example.com/settings',
        'https://example.com/reports'
      ];
      setCurrentPage(pages[Math.floor(Math.random() * pages.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BaseMonitor 
      title={`${title} - Sayfa İzleme`} 
      onClose={onClose} 
      defaultPosition="top-4 right-4"
      defaultSize={{ width: 500, height: 200 }}
    >
      <div className="h-full p-2 bg-gray-800">
        <div className="space-y-3">
          <div className="bg-gray-900 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Aktif Sayfa</h4>
            <div className="flex items-center gap-2 text-white">
              <Layout className="h-4 w-4" />
              <span className="font-mono text-sm">{currentPage}</span>
            </div>
          </div>

          <div className="bg-gray-900 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Sayfa Geçmişi</h4>
            <div className="space-y-1">
              {logs
                .filter(log => log.includes('http'))
                .slice(-5)
                .map((log, index) => (
                  <div key={index} className="text-sm text-gray-300 font-mono">
                    {log}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </BaseMonitor>
  );
}

export default PageMonitor