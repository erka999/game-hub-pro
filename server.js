const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected Successfully');
}).catch(err => {
    console.error('MongoDB Error:', err);
});

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
    ctx.reply('Welcome to Game Hub Pro! Play and earn diamonds! 💎');
});

bot.launch();

// 4. API for Mini App (Очир алмааз нэмэх хэсэг)
app.post('/api/add-diamonds', async (req, res) => {
    const { telegramId, amount } = req.body;
    try {
        let user = await User.findOne({ telegramId });
        if (!user) {
            user = new User({ telegramId, diamonds: amount });
        } else {
            user.diamonds += amount;
        }
        await user.save();
        res.json({ success: true, balance: user.diamonds });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// 5. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
