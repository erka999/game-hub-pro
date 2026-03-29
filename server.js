const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const app = express();

// 1. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB Error:', err));

// 2. Telegram Bot Configuration
const bot = new Telegraf(process.env.BOT_TOKEN);

// Welcome message in English
bot.start((ctx) => {
  ctx.reply('Welcome to Game Hub Pro! How can I help you today?');
});

bot.help((ctx) => {
  ctx.reply('If you need help, please contact the admin.');
});

// 3. Launch Bot
bot.launch()
  .then(() => console.log('Bot is running...'))
  .catch(err => console.error('Bot launch error:', err));

// 4. Render Web Server (Required for Render Free Tier)
app.get('/', (req, res) => res.send('Bot is Online!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
