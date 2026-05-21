const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const { startDailyFetch } = require('./cron/dailyFetch');

dotenv.config();


const app = express();
startDailyFetch();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'devpulse_secret_123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,    // false for localhost
        maxAge: 24 * 60 * 60 * 1000  // 1 day
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
});