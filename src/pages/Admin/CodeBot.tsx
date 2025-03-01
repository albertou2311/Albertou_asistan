import React, { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import LogMonitor from '../../components/monitors/LogMonitor';
import MetricsMonitor from '../../components/monitors/MetricsMonitor';
import PageMonitor from '../../components/monitors/PageMonitor';
import BotVideoMonitor from '../../components/monitors/BotVideoMonitor';

function CodeBot() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] Kod analizi yapılıyor... (${Math.floor(Math.random() * 100)}% tamamlandı)`;
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Code className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Kod Bot</h2>
        </div>
      </div>

      <BotVideoMonitor
        title="Kod Bot"
        onClose={() => {}}
      />

      <LogMonitor
        title="Kod Bot"
        logs={logs}
        onClose={() => {}}
      />

      <MetricsMonitor
        title="Kod Bot"
        onClose={() => {}}
      />

      <PageMonitor
        title="Kod Bot"
        logs={logs}
        onClose={() => {}}
      />
    </>
  );
}

export default CodeBot;