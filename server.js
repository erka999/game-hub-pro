const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// 1. MongoDB холболт
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB холбогдлоо...'))
  .catch(err => console.error('MongoDB алдаа:', err));

// 2. Telegram Бот
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome to Game Hub Pro!', {
    reply_markup: {
      inline_keyboard: [[
        { text: "Open Dashboard", web_app: { url: "https://" + process.env.RENDER_EXTERNAL_HOSTNAME } }
      ]]
    }
  });
});

bot.launch();

// 3. Static файлуудыг унших (index.html, chess.html г.м)
app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Render-д зориулсан сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
