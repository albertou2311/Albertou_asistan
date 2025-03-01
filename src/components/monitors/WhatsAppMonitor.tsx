import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Check, Clock, QrCode } from 'lucide-react';
import BaseMonitor from './BaseMonitor';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'incoming' | 'outgoing';
}

interface WhatsAppMonitorProps {
  title: string;
  onClose: () => void;
}

function WhatsAppMonitor({ title, onClose }: WhatsAppMonitorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        const newMessage: Message = {
          id: Math.random().toString(),
          content: `Bot aktivitesi: ${new Date().toLocaleTimeString()}`,
          timestamp: new Date().toISOString(),
          status: Math.random() > 0.5 ? 'delivered' : 'read',
          type: Math.random() > 0.5 ? 'incoming' : 'outgoing'
        };

        setMessages(prev => [newMessage, ...prev.slice(0, 19)]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

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

  const handleConnect = () => {
    setShowQR(true);
    // Simüle edilmiş bağlantı
    setTimeout(() => {
      setIsConnected(true);
      setShowQR(false);
    }, 5000);
  };

  return (
    <BaseMonitor 
      title={`${title} - WhatsApp İzleme`}
      onClose={onClose}
      defaultPosition="bottom-4 right-4"
      defaultSize={{ width: 400, height: 500 }}
    >
      <div className="h-full flex flex-col bg-gray-800">
        {!isConnected ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            {showQR ? (
              <>
                <div className="w-48 h-48 bg-white p-4 rounded-lg mb-4">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=whatsapp-connect"
                    alt="WhatsApp QR Code"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-white text-sm">WhatsApp Web'i açın ve bu QR kodu okutun</p>
              </>
            ) : (
              <>
                <QrCode className="h-16 w-16 text-white mb-4" />
                <h3 className="text-white font-medium mb-2">WhatsApp Bağlantısı</h3>
                <p className="text-gray-400 text-sm mb-4">
                  WhatsApp hesabınızı bağlamak için QR kodu okutun
                </p>
                <button
                  onClick={handleConnect}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Bağlan
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* WhatsApp Header */}
            <div className="bg-gray-700 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Bot WhatsApp</h3>
                  <span className="text-xs text-gray-300">Çevrimiçi</span>
                </div>
              </div>
              <Phone className="h-5 w-5 text-gray-300" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'outgoing'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      {message.type === 'outgoing' && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              ))}
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
                  className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                  disabled
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </BaseMonitor>
  );
}

export default WhatsAppMonitor;