const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB Connection
// process.env.MONGO_URI нь чиний .env файл дахь линкийг автоматаар уншина
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Error:', err));

// 2. User Schema
const UserSchema = new mongoose.Schema({
    telegramId: String,
    diamonds: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// 3. Telegram Bot Configuration
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Welcome to Game Hub Pro! 💎');
});

// Render дээр вэб хуудсаа харуулах хэсэг
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 4. API for Game
app.post('/api/add-diamonds', async (req, res) => {
    const { telegramId, amount } = req.body;
    try {
        let user = await User.findOneAndUpdate(
            { telegramId },
            { $inc: { diamonds: amount } },
            { upsert: true, new: true }
        );
        res.json({ success: true, balance: user.diamonds });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// 5. Start Server and Bot
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    bot.launch().then(() => console.log('Telegram Bot Started'));
});

// Алдаа гарвал серверийг унтраахгүй байх хэсэг
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
