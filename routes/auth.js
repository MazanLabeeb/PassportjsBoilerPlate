//routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");
/* POST login. */
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
                return res.json({ user, token });

            });
        })(req, res);
    });
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