const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    commits: {
        type: Number,
        default: 0
    },
    prsOpened: {
        type: Number,
        default: 0
    },
    prsMerged: {
        type: Number,
        default: 0
    },
    reposActive: {
        type: [String],
        default: []           // list of repo names active that day
    },
    languages: {
        type: Map,
        of: Number,
        default: {}           // { "JavaScript": 60, "Python": 40 }
    },
    streak: {
        type: Number,
        default: 0            // how many consecutive days coded
    },
    totalCommitsAllTime: {
        type: Number,
        default: 0
    }
});

// One stats entry per user per day — no duplicates
statsSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Stats', statsSchema);