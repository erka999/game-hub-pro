const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const app = express();

// 1. MongoDB холболт
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB холбогдлоо...'))
  .catch(err => console.error('MongoDB алдаа:', err));

// 2. Telegram Бот тохиргоо
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Сайн байна уу! Тоглоомдоо тавтай морил.');
});

bot.help((ctx) => ctx.reply('Тусламж хэрэгтэй юу?'));

// 3. Бот ажиллуулах
bot.launch()
  .then(() => console.log('Бот амжилттай аслаа...'))
  .catch(err => console.error('Бот эхлүүлэхэд алдаа гарлаа:', err));

// 4. Render-д зориулсан вэб сервер (Заавал байх ёстой)
app.get('/', (req, res) => res.send('Бот онлайн байна!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер ${PORT} порт дээр ажиллаж байна`);
});

// Процесс зогсоход ботыг аюулгүй унтраах
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
