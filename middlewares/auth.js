// authMiddleware.js

const passport = require('passport');

// Define your custom middleware function for JWT authentication
const authMiddleware = (req, res, next) => {
    passport.authenticate(['jwt'], { session: false }, (err, user, info) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized', error: err });
        }

        // If the user is not found, you can handle unauthorized access here
        if (!user) {
            return res.status(401).json({ message: info || 'Unauthorized' });
        }

        // If the user is authenticated, store the user object in the request for further use
        req.user = user;
        return next();
    })(req, res, next);
};

module.exports = authMiddleware;
