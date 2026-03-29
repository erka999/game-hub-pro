const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
// Чиний өмнөх зураг дээр харагдсан Cluster0 бааз руу холбогдоно
mongoose.connect('mongodb+srv://erdenee:70188818A@cluster0.gitqkyf.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected successfully'); //
}).catch(err => {
    console.error('Database connection error:', err);
});

// User Schema
const UserSchema = new mongoose.Schema({
    telegramId: String,
    diamonds: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Diamond add API (In English)
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
        res.json({ success: true, balance: user.diamonds }); //
    } catch (error) {
        console.error("Error updating diamonds:", error);
        res.status(500).json({ error: 'Internal Server Error' }); //
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); //
});
