//app.js
const express = require('express');
require('./passport');
const passport = require('passport');
const app = express();

const auth = require('./routes/auth');
const user = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', auth);
app.use('/user', passport.authenticate('jwt', { session: false }), user);


app.use('/auth', auth);

app.listen(8080, () => {
    console.log('Server started on port 8080')
});