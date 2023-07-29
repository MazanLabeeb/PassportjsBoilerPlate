//routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");

// req.body should contain email and password defined in the LocalStrategy
// new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
// }
router.post('/login',
    function (req, res, next) {
        passport.authenticate('local', { session: false }, (err, user, info) => {

            if (err || !user) {
                return res.status(400).json({
                    message: info || 'Something went wrong',
                    user: user
                });
            }

            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                // generate a signed son web token with the contents of user object and return it in the response
                const token = jwt.sign(user, 'your_jwt_secret');
                // output is shown at end of this file
                return res.json({ token });

            });
        })(req, res);
    });

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL for Google OAuth2 authentication
router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    function (req, res) {
        // Authentication successful, issue a JWT and send it in the response
        const user = req.user;
        const token = jwt.sign(user, 'your_jwt_secret');
        // we should set the expiry to 1 hour
        // const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '1h' })
        res.json({ token });
    }
);


router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Callback URL for Facebook OAuth2 authentication
router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    function (req, res) {
        // Authentication successful, issue a JWT and send it in the response
        const user = req.user;
        const token = jwt.sign(user, 'your_jwt_secret');
        res.json({ token });
    }
);


module.exports = router;


// {
//     "user": {
//         "id": 1,
//         "email": "test@user.com",
//         "firstName": "Mazan",
//         "lastName": "labeeb"
//     },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHVzZXIuY29tIiwiZmlyc3ROYW1lIjoiTWF6YW4iLCJsYXN0TmFtZSI6ImxhYmVlYiIsImlhdCI6MTY5MDY1MTMwNn0.-YNvypYp6CNRWAHVQtrM0ahp1zKeuWbZhcngBAYgk0k"
// }