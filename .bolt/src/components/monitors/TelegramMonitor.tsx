import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Phone, Check, Clock, AlertCircle } from 'lucide-react';
import BaseMonitor from './BaseMonitor';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'incoming' | 'outgoing';
  from: string;
}

interface TelegramMonitorProps {
  title: string;
  onClose: () => void;
}

function TelegramMonitor({ title, onClose }: TelegramMonitorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      ws.current = new WebSocket('ws://localhost:8080');

      ws.current.onopen = () => {
        console.log('WebSocket bağlantısı kuruldu');
        setIsConnected(true);
        setConnectionError(null);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            const newMessage: Message = {
              id: Math.random().toString(),
              content: data.data.text,
              timestamp: data.data.timestamp,
              status: 'delivered',
              type: 'incoming',
              from: data.data.from
            };
            setMessages(prev => [newMessage, ...prev]);
          }
        } catch (error) {
          console.error('Mesaj işlenirken hata:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket bağlantısı kesildi');
        setIsConnected(false);
        // 5 saniye sonra yeniden bağlanmayı dene
        reconnectTimeout.current = setTimeout(() => {
          connect();
        }, 5000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket hatası:', error);
        setConnectionError('Bağlantı hatası oluştu');
      };
    } catch (error) {
      console.error('WebSocket bağlantısı oluşturulurken hata:', error);
      setConnectionError('Bağlantı oluşturulamadı');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return <Check className="h-4 w-4 text-blue-400" />;
      case 'read':
        return (
          <div className="flex">
            <Check className="h-4 w-4 text-blue-400" />
            <Check className="h-4 w-4 -ml-2 text-blue-400" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BaseMonitor 
      title={`${title} - Telegram İzleme`}
      onClose={onClose}
      defaultPosition="bottom-4 right-[420px]"
      defaultSize={{ width: 400, height: 500 }}
    >
      <div className="h-full flex flex-col bg-gray-800">
        {/* Telegram Header */}
        <div className="bg-gray-700 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">Bot Telegram</h3>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-300">
                  {isConnected ? 'Çevrimiçi' : 'Bağlantı kesik'}
                </span>
              </div>
            </div>
          </div>
          <Phone className="h-5 w-5 text-gray-300" />
        </div>

        {/* Connection Error */}
        {connectionError && (
          <div className="bg-red-500 bg-opacity-10 p-2 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{connectionError}</span>
            <button
              onClick={connect}
              className="ml-auto text-xs bg-red-500 bg-opacity-20 px-2 py-1 rounded hover:bg-opacity-30"
            >
              Yeniden Dene
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare className="h-12 w-12 mb-2" />
              <p className="text-sm">Henüz mesaj yok</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'outgoing'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  {message.type === 'incoming' && (
                    <div className="text-xs text-gray-300 mb-1">{message.from}</div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                    {message.type === 'outgoing' && getStatusIcon(message.status)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="bg-gray-700 p-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Mesaj yazın..."
              className="flex-1 bg-gray-600 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
            <button
              className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </BaseMonitor>
  );
}

export default TelegramMonitor;