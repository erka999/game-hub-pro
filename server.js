const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB холболт
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB амжилттай холбогдлоо!'))
    .catch(err => console.error('MongoDB холболтын алдаа:', err));

// 2. Өгөгдлийн сангийн бүтэц
const UserSchema = new mongoose.Schema({
    telegramId: String,
    diamonds: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// 3. Telegram Bot тохиргоо
if (!process.env.BOT_TOKEN) {
    console.error('АЛДАА: BOT_TOKEN олдсонгүй! .env файлаа шалгана уу.');
}
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Game Hub Pro-д тавтай морил! 💎 Апп-аа доорх цэсээр нээнэ үү.');
});

// 4. Вэб хуудсыг харуулах (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 5. Очир алмааз нэмэх API
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
        res.status(500).json({ error: 'Өгөгдлийн сангийн алдаа' });
    }
});

// 6. Сервер асаах
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер ${PORT} порт дээр ажиллаж байна...`);
    bot.launch().then(() => console.log('Telegram Bot амжилттай аслаа!'));
});

// Зогсоох үеийн тохиргоо
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
