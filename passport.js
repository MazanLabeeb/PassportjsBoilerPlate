//passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const db = [
    {
        email: 'test@user.com',
        password: '12345',
        id: 1,
        firstName: 'Mazan',
        lastName: 'labeeb',
        github: 'https://www.github.com/MazanLabeeb',
    }
];

// following code will be run when we call passport.authenticate('local', { session: false })
// in routes\auth.js
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    function (email, password, cb) {
        let user = db.find(user => user.email === email);

        if (!user) {
            // the following message will be passed to info in the next middleware in routes\auth.js
            return cb(null, false, 'Incorrect email.');
        }

        if (user.password !== password) {
            // the following message will be passed to info in the next middleware in routes\auth.js
            return cb(null, false, 'Incorrect password.');
        }

        // following information will be stored in the jwt token
        let userObjForToken = {
            id: user.id
        };

        //  the following object will be available as req.user in the next middleware in routes\auth.js
        return cb(null, userObjForToken, 'Logged In Successfully');
    }
));



// after using the following passportjs middleware,we shall be able to use the :
// "passport.authenticate('jwt', { session: false }),"
// as a middleware for authentication

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
},
    function (decodedjwtPayload, cb) {
        // jwt has been decoded, we have now the user's id in decodedjwtPayload.id
        // we can use this id to get the user's data from the database
        let getUser = db.find(user => user.id === decodedjwtPayload.id);


        if (getUser) {
            // following object will be available as req.user in our routes
            let userObjForReqBody = {
                id: getUser.id,
                email: getUser.email,
                firstName: getUser.firstName,
                lastName: getUser.lastName,
            }

            return cb(null, userObjForReqBody);
        } else {
            return cb(null, false, { message: 'User not found. Your account may have been removed. Please contact the administrator.' });
        }

    }
));