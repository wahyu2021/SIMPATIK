const { 
    default: makeWASocket, 
    DisconnectReason, 
    useMultiFileAuthState 
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const express = require('express');

const app = express();
const port = 3000;
app.use(express.json());

let sock;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('--- SILAKAN SCAN QR CODE DI BAWAH ---');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            
            console.log('❌ Koneksi terputus. Reason:', lastDisconnect?.error?.message || 'Unknown');
            console.log('Status Code:', statusCode);
            console.log('Reconnecting:', shouldReconnect);

            if (shouldReconnect) {
                setTimeout(connectToWhatsApp, 3000); // Tunggu 3 detik sebelum coba lagi
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Terhubung!');
        }
    });
}

// Endpoint untuk mengirim pesan
app.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'Phone and message are required' });
    }

    if (!sock?.user) {
        return res.status(500).json({ error: 'WhatsApp not connected' });
    }

    try {
        let formattedPhone = phone.replace(/[^0-9]/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '62' + formattedPhone.slice(1);
        }
        if (!formattedPhone.endsWith('@s.whatsapp.net')) {
            formattedPhone += '@s.whatsapp.net';
        }

        await sock.sendMessage(formattedPhone, { text: message });
        res.json({ success: true, message: 'Pesan terkirim ke ' + formattedPhone });
    } catch (error) {
        console.error('Gagal kirim pesan:', error);
        res.status(500).json({ error: 'Gagal mengirim pesan' });
    }
});

app.get('/status', (req, res) => {
    res.json({ connected: !!sock?.user });
});

app.listen(port, () => {
    console.log(`🚀 WA Gateway Server running at http://localhost:${port}`);
});

connectToWhatsApp();
