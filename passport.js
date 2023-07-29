//passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


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

// Replace with your own Google OAuth2 credentials
const googleClientId = '997028513069-4orun09vvp6gnfegtg9ndvsl9401c4gn.apps.googleusercontent.com';
const googleClientSecret = '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';

// Replace with your own Facebook OAuth2 credentials
const facebookAppId = '1734271240174527';
const facebookAppSecret = '209ca7b615095533cbbab3319a6c1e53';

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


// Configure the Google OAuth2 strategy
passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: '/auth/google/callback',
},
    function (accessToken, refreshToken, profile, cb) {
        let user = db.find(user => user.email === profile?.emails[0]?.value);

        //    if user is not found in db, we will create a new user
        if (!user) {
            let newUser = {
                email: profile?.emails[0]?.value,
                firstName: profile?.name?.givenName,
                lastName: profile?.name?.familyName,
                picture: profile?.photos[0]?.value,
                id: profile?.id,
            }

            //  we will add the new user to the db
            db.push(newUser);

            //  we will set the user to the newUser object
            user = newUser;
        }

        let userObjForToken = {
            id: user.id
        };

        return cb(null, userObjForToken);
    }
));



// Configure the Facebook strategy
passport.use(new FacebookStrategy({
    clientID: facebookAppId,
    clientSecret: facebookAppSecret,
    callbackURL: '/auth/facebook/callback', // Replace with your actual callback URL
    profileFields: ['id', 'email', 'first_name', 'last_name', 'picture'], // Request specific profile fields
},
    function (accessToken, refreshToken, profile, cb) {
        // In this example, we're just using the profile data for demonstration purposes.
        // You can save or retrieve the user data from your database here.

        // For simplicity, we'll use a static user data array defined above.
        const user = db.find(u => u.email === profile.emails[0].value);

        // If user is not found, create a new user.
        if (!user) {
            const newUser = {
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                picture: profile.photos[0].value,
                id: profile.id,
            };

            // Add the new user to the database.
            db.push(newUser);

            // Set the user to the newUser object.
            user = newUser;
        }

        // Create the user object for the JWT token.
        const userObjForToken = {
            id: user.id
        };

        // Return the user object.
        return cb(null, userObjForToken);
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
                picture: getUser.picture,

            }

            return cb(null, userObjForReqBody);
        } else {
            return cb(null, false, { message: 'User not found. Your account may have been removed. Please contact the administrator.' });
        }

    }
));