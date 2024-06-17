// Load required modules
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Create Express app
const app = express();

// Set port
const port = 3000 || process.env.PORT;

// Set up database connection
const dbConfig = {
    host: process.env.localhost || 'localhost',
    user: process.env.user ||'root',
    password: process.env.password || '',
    database: process.env.database || 'warmlly'
};
const db = mysql.createConnection(dbConfig);

// Middleware
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport setup
passport.use(
    new GoogleStrategy({
        clientID: process.env.clientID || 'YOUR_CLIENT_ID',
        clientSecret: process.env.clientSecret || 'YOUR_CLIENT_SECRET',
        callbackURL: process.env.callbackURL || 'http://localhost:3000/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOrCreate({ googleId: profile.id }, (err, user) => {
            done(err, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Password functions
function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

function comparePasswords(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Set up static files
app.use(express.static(path.join(__dirname, 'assets')));

// Set up routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'src', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'src', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname,'src', 'signup.html'));
});

app.get('/business', (req, res) => {
    res.sendFile(path.join(__dirname,'src', 'business.html'));
});

app.get('/restaurant', (req, res) => {
    res.sendFile(path.join(__dirname,'src', 'restaurant.html'));
});

app.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname,'src', 'logout.html'));
}); 

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname,'src', 'menu.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

