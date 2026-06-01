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
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Koneksi terputus. Reconnecting:', shouldReconnect);
            if (shouldReconnect) connectToWhatsApp();
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

    if (!sock) {
        return res.status(500).json({ error: 'WhatsApp not connected' });
    }

    try {
        // Format nomor: 0812... menjadi 62812... @s.whatsapp.net
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
