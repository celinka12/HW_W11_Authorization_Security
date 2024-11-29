const express = require (`express`);
const session = require(`express-session`);
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUnitialized: true
}));

app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

// menggunakan pass utk google strategi
passport.use(new GoogleStrategy({
    clientID:"176330459272-krrv4v9ob51elp7uceimsv24pgmi1dg3.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:3000/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}
));

// integrasi session ke passport
passport.serializeUser((user, done) => {
    done(null, user);
});
// menghapus session
passport.deserializeUser((obj, done) => {
    done(null, obj);
});


//render file bernama index
app.get('/', (req, res) => {
    res.render('index');
});

//login,  menjalankan passport utk authentikasi yg menyatakan ingin akses apa
app.get('/auth/google',
   passport.authenticate('google', {
    scope: ['profile', 'email'],  // profile, email sesuai yg di req di google console 
    prompt: 'select_account' })); // agar user memilih akun mn yg di sign in


// user gagal login, diarahkan ke url root kmbli ke index
app.get("/auth/google/callback", passport.authenticate('google',{failureRedirect: '/'}), (req, res) =>{
    res.redirect('/profile'); // berhasil, msk e profile
});

// mengecek user sdh login/tdk
app.get('/profile',(req,res) => {
    if(!req.isAuthenticated()){
        return res.redirect('/auth/google');
    }
    res.render("profile", {user: req.user}); //req user index dr object return sign in google
});

//code logout 
app.get('/logout', (req,res) => {
    req.logout(err => {
        if(err) return next(err);
        res.redirect('/'); //redirect home index
    });
});

// nama port 
app.listen(3000, () => {
    console.log('Server running on port 3000');
});


