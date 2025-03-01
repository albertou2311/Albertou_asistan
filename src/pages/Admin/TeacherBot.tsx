import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import LogMonitor from '../../components/monitors/LogMonitor';
import MetricsMonitor from '../../components/monitors/MetricsMonitor';
import PageMonitor from '../../components/monitors/PageMonitor';
import BotVideoMonitor from '../../components/monitors/BotVideoMonitor';

function TeacherBot() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] Sistem aktivitesi izleniyor... (${Math.floor(Math.random() * 100)}% işlem gücü)`;
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Öğretmen Bot</h2>
        </div>
      </div>

      <BotVideoMonitor
        title="Öğretmen Bot"
        onClose={() => {}}
      />

      <LogMonitor
        title="Öğretmen Bot"
        logs={logs}
        onClose={() => {}}
      />

      <MetricsMonitor
        title="Öğretmen Bot"
        onClose={() => {}}
      />

      <PageMonitor
        title="Öğretmen Bot"
        logs={logs}
        onClose={() => {}}
      />
    </>
  );
}

export default TeacherBot;