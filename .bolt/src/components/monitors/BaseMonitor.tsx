import React, { useState, ReactNode } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';

interface BaseMonitorProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  defaultPosition: string;
  defaultSize?: {
    width: number;
    height: number;
  };
}

function BaseMonitor({ title, children, onClose, defaultPosition, defaultSize }: BaseMonitorProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  const defaultSizeStyle = defaultSize 
    ? `w-[${defaultSize.width}px] h-[${defaultSize.height}px]`
    : 'w-[500px] h-[300px]';

  return (
    <div 
      className={`fixed ${
        isMaximized ? 'inset-4' : `${defaultPosition} ${defaultSizeStyle}`
      } bg-gray-900 rounded-lg shadow-xl transition-all duration-300 flex flex-col`}
      style={{
        ...(!isMaximized && defaultSize ? {
          width: defaultSize.width,
          height: defaultSize.height
        } : {}),
        zIndex: isMaximized ? 9999 : 50
      }}
    >
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <h3 className="text-white font-medium text-sm">{title}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default BaseMonitor;