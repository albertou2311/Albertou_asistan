import React from 'react';
import BaseMonitor from './BaseMonitor';

interface BotVideoMonitorProps {
  title: string;
  onClose: () => void;
}

function BotVideoMonitor({ title, onClose }: BotVideoMonitorProps) {
  return (
    <BaseMonitor 
      title={`${title} - Canlı İzleme`} 
      onClose={onClose} 
      defaultPosition="top-4 right-[520px]"
      defaultSize={{ width: 500, height: 500 }}
    >
      <div className="h-full bg-gray-800">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4 w-full h-full p-2">
            <div className="animate-pulse bg-gray-700 rounded-lg h-[400px] w-full"></div>
            <div className="flex items-center justify-between px-4">
              <p className="text-gray-400">Bot aktivitesi canlı olarak izleniyor...</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 text-sm">Canlı</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseMonitor>
  );
}

export default BotVideoMonitor;