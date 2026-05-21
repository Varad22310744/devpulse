const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: true,
        unique: true        // no duplicate GitHub accounts
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''         // GitHub profile picture URL
    },
    accessToken: {
        type: String,
        required: true      // needed to call GitHub API later
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);