const authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();   // user logged in — continue to route
    }
    res.status(401).json({ message: 'Unauthorized. Please login.' });
};

module.exports = authMiddleware;