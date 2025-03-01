import React, { useState, useEffect } from 'react';
import { Activity, Cpu } from 'lucide-react';
import BaseMonitor from './BaseMonitor';

interface MetricsMonitorProps {
  title: string;
  onClose: () => void;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  network: number;
}

function MetricsMonitor({ title, onClose }: MetricsMonitorProps) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    network: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: Math.random() * 100
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BaseMonitor 
      title={`${title} - Sistem Metrikleri`} 
      onClose={onClose} 
      defaultPosition="bottom-4 right-[520px]"
      defaultSize={{ width: 500, height: 200 }}
    >
      <div className="h-full p-2 bg-gray-800">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
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
            <div className="flex justify-between text-sm mb-1">
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
            <div className="flex justify-between text-sm mb-1">
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

      <div className="px-3 py-2 border-t border-gray-700 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-green-400">
            <Activity className="h-4 w-4" />
            Aktif
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <Cpu className="h-4 w-4" />
            {Math.round(metrics.cpu)}% CPU
          </span>
        </div>
        <span className="text-gray-400 text-xs">
          {new Date().toLocaleTimeString()}
        </span>
      </div>
    </BaseMonitor>
  );
}

export default MetricsMonitor;