import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import LogMonitor from '../../components/monitors/LogMonitor';
import MetricsMonitor from '../../components/monitors/MetricsMonitor';
import PageMonitor from '../../components/monitors/PageMonitor';
import BotVideoMonitor from '../../components/monitors/BotVideoMonitor';

function KaliBot() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] Kali sistem aktivitesi izleniyor... (${Math.floor(Math.random() * 100)}% işlem gücü)`;
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Kali Bot</h2>
        </div>
      </div>

      <BotVideoMonitor
        title="Kali Bot"
        onClose={() => {}}
      />

      <LogMonitor
        title="Kali Bot"
        logs={logs}
        onClose={() => {}}
      />

      <MetricsMonitor
        title="Kali Bot"
        onClose={() => {}}
      />

      <PageMonitor
        title="Kali Bot"
        logs={logs}
        onClose={() => {}}
      />
    </>
  );
}

export default KaliBot;