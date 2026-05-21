const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://devpulse-silk.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.JWT_SECRET || 'devpulse_secret_123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// DB Connection
require('./config/db');

// Passport config
require('./config/passport');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/report', require('./routes/report'));

// Test route
app.get('/', (req, res) => {
    res.send('DevPulse API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start cron AFTER server ready
    const { startDailyFetch } = require('./cron/dailyFetch');
    startDailyFetch();
});