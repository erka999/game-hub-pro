const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB Холболт
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB амжилттай холбогдлоо!'))
    .catch(err => console.error('❌ MongoDB холболтын алдаа:', err));

// 2. Хэрэглэгчийн бүтэц
const User = mongoose.model('User', new mongoose.Schema({
    telegramId: String,
    diamonds: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now }
}));

// 3. Telegram Bot тохиргоо
if (!process.env.BOT_TOKEN) {
    console.error('❌ АЛДАА: BOT_TOKEN олдсонгүй!');
}
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('💎 Game Hub Pro-д тавтай морил! Тоглоомоо эхлүүлээрэй.');
});

// 4. API (Очир алмааз нэмэх)
app.post('/api/add-diamonds', async (req, res) => {
    const { telegramId, amount } = req.body;
    try {
        let user = await User.findOneAndUpdate(
            { telegramId },
            { $inc: { diamonds: amount }, lastUpdate: Date.now() },
            { upsert: true, new: true }
        );
        res.json({ success: true, balance: user.diamonds });
    } catch (error) {
        res.status(500).json({ error: 'Баазын алдаа' });
    }
});

// 5. Сервер болон Бот асаах
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер ${PORT} порт дээр аслаа`);
    bot.launch()
        .then(() => console.log('🤖 Telegram Bot амжилттай ажиллаж байна!'))
        .catch(err => console.error('❌ Бот асахад алдаа гарлаа:', err));
});

// Ажиллагааг зөв зогсоох
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
