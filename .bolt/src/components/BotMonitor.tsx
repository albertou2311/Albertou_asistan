import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, Minimize2, X, Layout, Activity, Cpu } from 'lucide-react';

interface BotMonitorProps {
  title: string;
  logs: string[];
  onClose: () => void;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  network: number;
}

function BotMonitor({ title, logs, onClose }: BotMonitorProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'metrics' | 'pages'>('logs');
  const [metrics, setMetrics] = useState<SystemMetrics>({ cpu: 0, memory: 0, network: 0 });
  const [currentPage, setCurrentPage] = useState<string>('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Otomatik scroll
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Sistem metriklerini simüle et
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: Math.random() * 100
      });
      
      // Simüle edilmiş sayfa değişiklikleri
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
    <div 
      className={`fixed ${
        isMaximized ? 'inset-4' : 'bottom-4 right-4 w-[600px] h-[400px]'
      } bg-gray-900 rounded-lg shadow-xl transition-all duration-300 z-50 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="text-white font-medium flex items-center gap-2">
          {title} - Canlı İzleme
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-sm ${
            activeTab === 'logs'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Log Kayıtları
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 text-sm ${
            activeTab === 'metrics'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sistem Metrikleri
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 text-sm ${
            activeTab === 'pages'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sayfa İzleme
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'logs' && (
          <div className="h-full overflow-auto p-4 bg-gray-800">
            <div className="font-mono text-sm space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-green-400">
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="h-full p-4 bg-gray-800">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">CPU Kullanımı</span>
                  <span className="text-white">{Math.round(metrics.cpu)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.cpu}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Bellek Kullanımı</span>
                  <span className="text-white">{Math.round(metrics.memory)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.memory}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Ağ Aktivitesi</span>
                  <span className="text-white">{Math.round(metrics.network)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.network}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="h-full p-4 bg-gray-800">
            <div className="space-y-4">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Aktif Sayfa</h4>
                <div className="flex items-center gap-2 text-white">
                  <Layout className="h-4 w-4" />
                  <span className="font-mono text-sm">{currentPage}</span>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Sayfa Geçmişi</h4>
                <div className="space-y-2">
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
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-gray-700 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-green-400">
            <Activity className="h-4 w-4" />
            Aktif
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <Cpu className="h-4 w-4" />
            {Math.round(metrics.cpu)}% CPU
          </span>
        </div>
        <span className="text-gray-400">
          Son güncelleme: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

export default BotMonitor;