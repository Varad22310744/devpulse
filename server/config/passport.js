const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email', 'repo', 'read:user']
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ githubId: profile.id });

            if (user) {
                // User exists — update access token
                user.accessToken = accessToken;
                await user.save();
                return done(null, user);
            }

            // New user — create in database
            user = await User.create({
                githubId: profile.id,
                username: profile.username,
                email: profile.emails?.[0]?.value || '',
                avatar: profile.photos?.[0]?.value || '',
                accessToken: accessToken
            });

            return done(null, user);

        } catch (error) {
            return done(error, null);
        }
    }));

// Save user ID in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Fetch user from session ID
// CORRECT
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);   // ✅ pass user not done
    } catch (error) {
        done(error, null);
    }
});