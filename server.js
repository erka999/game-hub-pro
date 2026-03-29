const express = require('express');
const mongoose = require('mongoose');
const { Telegraf } = require('telegraf');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB холболт
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB холбогдлоо'))
  .catch(err => console.error('Алдоо:', err));

// Хэрэглэгчийн дата загвар
const User = mongoose.model('User', {
  telegramId: Number,
  balance: { type: Number, default: 0 },
  referrals: { type: Number, default: 0 }
});

// Telegram Бот тохиргоо
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const referrerId = ctx.startPayload; // Найзын линкээр орж ирсэн эсэх

  let user = await User.findOne({ telegramId: userId });

  if (!user) {
    user = new User({ telegramId: userId });
    await user.save();

    // Хэрэв найзын линкээр орж ирсэн бол уригчид бонус өгөх
    if (referrerId) {
      const referrer = await User.findOne({ telegramId: referrerId });
      if (referrer) {
        referrer.balance += 0.001;
        referrer.referrals += 1;
        await referrer.save();
        bot.telegram.sendMessage(referrerId, "Найз чинь нэгдлээ! Танд $0.001 бонус орлоо.");
      }
    }
  }

  ctx.reply("GameHub Pro-д тавтай морил! Тоглоод мөнгө олж эхлээрэй.", {
    reply_markup: {
      inline_keyboard: [[{ text: "Тоглоом нээх", web_app: { url: process.env.WEBAPP_URL } }]]
    }
  });
});

bot.launch();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер ${PORT} порт дээр аслаа`));
