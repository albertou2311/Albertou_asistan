import React, { useState, useEffect } from 'react';
import { Bot, Brain, Terminal, Code, Mail, Activity, AlertCircle } from 'lucide-react';
import TelegramMonitor from '../../components/monitors/TelegramMonitor';

interface BotStatus {
  id: string;
  name: string;
  status: 'idle' | 'learning' | 'working' | 'error';
  lastActivity: string;
  logs: string[];
  performance: number;
}

const INITIAL_BOTS: BotStatus[] = [
  {
    id: 'teacher-bot',
    name: 'Öğretmen Bot',
    status: 'idle',
    lastActivity: new Date().toISOString(),
    logs: ['Sistem başlatıldı'],
    performance: 85
  },
  {
    id: 'windows-bot',
    name: 'Windows Bot',
    status: 'idle',
    lastActivity: new Date().toISOString(),
    logs: ['Sistem başlatıldı'],
    performance: 90
  },
  {
    id: 'kali-bot',
    name: 'Kali Bot',
    status: 'idle',
    lastActivity: new Date().toISOString(),
    logs: ['Sistem başlatıldı'],
    performance: 88
  },
  {
    id: 'code-bot',
    name: 'Kod Bot',
    status: 'idle',
    lastActivity: new Date().toISOString(),
    logs: ['Sistem başlatıldı'],
    performance: 92
  }
];

function AssistantAdmin() {
  const [bots, setBots] = useState<BotStatus[]>(INITIAL_BOTS);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    frequency: 'daily',
    time: '20:00'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBots(currentBots => 
        currentBots.map(bot => ({
          ...bot,
          performance: Math.min(100, bot.performance + Math.random() * 2 - 1),
          status: Math.random() > 0.8 ? 'learning' : 'idle',
          lastActivity: new Date().toISOString(),
          logs: [`[${new Date().toLocaleTimeString()}] Bot aktivitesi devam ediyor...`, ...bot.logs.slice(0, 9)]
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getBotIcon = (botId: string) => {
    switch (botId) {
      case 'teacher-bot':
        return Brain;
      case 'windows-bot':
        return Terminal;
      case 'kali-bot':
        return Bot;
      case 'code-bot':
        return Code;
      default:
        return Bot;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle':
        return 'bg-gray-500';
      case 'learning':
        return 'bg-blue-500';
      case 'working':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Asistan Yönetimi</h2>
        <div className="flex items-center gap-4">
          <Mail className="h-5 w-5 text-gray-400" />
          <select
            value={emailSettings.frequency}
            onChange={(e) => setEmailSettings({ ...emailSettings, frequency: e.target.value })}
            className="bg-gray-800 text-white rounded-md border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="daily">Günlük Rapor</option>
            <option value="weekly">Haftalık Rapor</option>
            <option value="monthly">Aylık Rapor</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bots.map(bot => {
          const Icon = getBotIcon(bot.id);
          return (
            <div
              key={bot.id}
              className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-transform hover:scale-105 ${
                selectedBot === bot.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedBot(bot.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
                </div>
                <div className={`h-3 w-3 rounded-full ${getStatusColor(bot.status)}`} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Performans</span>
                  <span>{Math.round(bot.performance)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${bot.performance}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBot && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-blue-500" />
              <h3 className="text-xl font-semibold text-white">Bot Aktivitesi</h3>
            </div>
            <button
              onClick={() => setSelectedBot(null)}
              className="text-gray-400 hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Durum</h4>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${
                    getStatusColor(bots.find(b => b.id === selectedBot)?.status || 'idle')
                  }`} />
                  <span className="text-lg font-medium text-white capitalize">
                    {bots.find(b => b.id === selectedBot)?.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Son Aktivite</h4>
                <span className="text-lg font-medium text-white">
                  {new Date(bots.find(b => b.id === selectedBot)?.lastActivity || '').toLocaleString()}
                </span>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Performans</h4>
                <span className="text-lg font-medium text-white">
                  {Math.round(bots.find(b => b.id === selectedBot)?.performance || 0)}%
                </span>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-4">Log Kayıtları</h4>
              <div className="space-y-2">
                {bots.find(b => b.id === selectedBot)?.logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-300">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Telegram Monitörü */}
      <TelegramMonitor
        title="AI Asistan"
        onClose={() => {}}
      />
    </div>
  );
}

export default AssistantAdmin;