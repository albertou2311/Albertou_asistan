import React, { useRef, useEffect } from 'react';
import BaseMonitor from './BaseMonitor';

interface LogMonitorProps {
  title: string;
  logs: string[];
  onClose: () => void;
}

function LogMonitor({ title, logs, onClose }: LogMonitorProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <BaseMonitor 
      title={`${title} - Log Kayıtları`} 
      onClose={onClose} 
      defaultPosition="bottom-4 right-4"
      defaultSize={{ width: 500, height: 500 }}
    >
      <div className="h-full overflow-auto p-2 bg-gray-800">
        <div className="font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index} className="text-green-400 leading-tight py-0.5">
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </BaseMonitor>
  );
}

export default LogMonitor