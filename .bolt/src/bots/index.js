import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { botAPI } from './api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasını doğru konumdan yükle
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// WebSocket Server
const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket sunucusu başlatılıyor...');

// Bağlı istemcileri takip et
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Yeni bir istemci bağlandı');
    clients.add(ws);
    
    // Bağlantı durumunu kontrol et
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    
    ws.on('close', () => {
        console.log('İstemci bağlantısı kesildi');
        clients.delete(ws);
    });

    // Hoş geldin mesajı gönder
    ws.send(JSON.stringify({
        type: 'message',
        data: {
            from: 'System',
            text: 'WebSocket bağlantısı başarıyla kuruldu',
            timestamp: new Date().toISOString()
        }
    }));
});

// Her 30 saniyede bir bağlantıları kontrol et
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) {
            clients.delete(ws);
            return ws.terminate();
        }
        
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

wss.on('close', () => {
    clearInterval(interval);
});

// Telegram Bot
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('TELEGRAM_BOT_TOKEN bulunamadı!');
    process.exit(1);
}

console.log('Telegram bot başlatılıyor...');

const telegram = new TelegramBot(token, {
    polling: true,
    webHook: false
});

telegram.on('polling_error', (error) => {
    console.error('Polling error:', error);
    // WebSocket istemcilerine hata bilgisi gönder
    broadcast({
        type: 'error',
        data: {
            message: 'Telegram bot bağlantı hatası',
            error: error.message
        }
    });
});

telegram.on('error', (error) => {
    console.error('Bot error:', error);
    // WebSocket istemcilerine hata bilgisi gönder
    broadcast({
        type: 'error',
        data: {
            message: 'Telegram bot hatası',
            error: error.message
        }
    });
});

// Tüm bağlı istemcilere mesaj gönder
function broadcast(message) {
    clients.forEach((client) => {
        if (client.readyState === 1) { // OPEN
            client.send(JSON.stringify(message));
        }
    });
}

telegram.on('message', async (msg) => {
    try {
        const chatId = msg.chat.id;
        console.log('Yeni mesaj alındı:', msg.text);
        
        // WebSocket istemcilerine mesajı gönder
        broadcast({
            type: 'message',
            data: {
                from: msg.from.username || msg.from.first_name,
                text: msg.text,
                timestamp: new Date().toISOString()
            }
        });

        if (msg.text?.startsWith('/')) {
            const command = msg.text.slice(1).toLowerCase();
            const args = command.split(' ');
            
            switch (args[0]) {
                case 'start':
                    await telegram.sendMessage(chatId, 'Merhaba! AI Asistan botuna hoş geldiniz. Komutları görmek için /yardim yazabilirsiniz.');
                    break;

                case 'durum':
                    await telegram.sendMessage(chatId, 'Sistem aktif ve çalışıyor!');
                    break;

                case 'yardim':
                    await telegram.sendMessage(chatId, `Mevcut komutlar:
/start - Bot ile tanışın
/durum - Sistem durumunu gösterir
/yardim - Komut listesini gösterir
/rapor - Günlük raporu gösterir
/urunler [kategori] - Ürünleri listeler
/urun [id] - Ürün detayını gösterir`);
                    break;

                case 'rapor':
                    const report = await botAPI.getDailyReport();
                    if (report) {
                        await telegram.sendMessage(chatId, `📊 Günlük Rapor:
• Yeni Mesaj: ${report.messages}
• Yeni Yorum: ${report.comments}
• Düşük Stok: ${report.lowStock} ürün`);
                    } else {
                        await telegram.sendMessage(chatId, 'Rapor alınırken bir hata oluştu.');
                    }
                    break;

                case 'urunler':
                    const category = args[1];
                    const products = await botAPI.getProducts(category);
                    if (products.length > 0) {
                        let message = '📦 Ürün Listesi:\n\n';
                        products.slice(0, 5).forEach(product => {
                            message += `• ${product.name}\n`;
                            message += `  Fiyat: ${product.price}TL\n`;
                            message += `  Stok: ${product.stock} adet\n\n`;
                        });
                        await telegram.sendMessage(chatId, message);
                    } else {
                        await telegram.sendMessage(chatId, 'Ürün bulunamadı.');
                    }
                    break;

                case 'urun':
                    const productId = args[1];
                    if (productId) {
                        const product = await botAPI.getProduct(productId);
                        if (product) {
                            let message = `📦 ${product.name}\n\n`;
                            message += `Açıklama: ${product.description}\n`;
                            message += `Fiyat: ${product.price}TL\n`;
                            message += `Stok: ${product.stock} adet\n`;
                            message += `Kategori: ${product.category}`;
                            await telegram.sendMessage(chatId, message);
                        } else {
                            await telegram.sendMessage(chatId, 'Ürün bulunamadı.');
                        }
                    } else {
                        await telegram.sendMessage(chatId, 'Lütfen bir ürün ID\'si belirtin.');
                    }
                    break;
            }

            // Mesajı kaydet
            await botAPI.saveMessage(msg.from.username || msg.from.first_name, msg.text, 'telegram');
        }
    } catch (error) {
        console.error('Mesaj işlenirken hata:', error);
        broadcast({
            type: 'error',
            data: {
                message: 'Mesaj işleme hatası',
                error: error.message
            }
        });
    }
});

console.log('Bot sistemi başlatıldı ve hazır.');