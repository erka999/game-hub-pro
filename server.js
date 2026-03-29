const express = require('express');
const mongoose = require('mongoose');
const { Telegraf } = require('telegraf');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB холболт
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB холбогдлоо'))
  .catch(err => console.error('MongoDB алдаа:', err));

// Telegram Бот тохиргоо
const bot = new Telegraf(process.env.BOT_TOKEN);

// Энэ хэсэгт хаалт (});) заавал байх ёстой
bot.start((ctx) => {
  ctx.reply('Сайн байна уу! Тоглоомдоо тавтай морил.');
});

bot.launch();

// Үндсэн сервер ажиллуулах
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер ${PORT} порт дээр ажиллаж байна`);
});
