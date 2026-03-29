const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB холболт - Энэ хэсгийг заавал бүрэн бичих ёстой
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB холбогдлоо...'))
  .catch(err => console.error('MongoDB холболтын алдаа:', err));

// Telegram Бот тохиргоо
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Сайн байна уу! Тоглоомдоо тавтай морил.');
});

// Алдаа барих хэсэг
bot.catch((err, ctx) => {
    console.log(`Бот дээр алдаа гарлаа: ${ctx.update_type}`, err);
});

// Бот эхлүүлэх
bot.launch();
console.log('Бот амжилттай аслаа...');

// Render-д зориулсан энгийн сервер (Заавал байх ёстой)
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Бот ажиллаж байна!'));
app.listen(process.env.PORT || 3000);
