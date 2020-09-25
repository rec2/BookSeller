require('dotenv').config();
const {
    configureApp,
    app,
    passport
} = require("./lib/app-configure");
const passportLocalMongoose = require("passport-local-mongoose");
const {
    connectDB,
    mongoose,
    upload
} = require("./lib/connect-mongo");
const {
    User,
    Book
} = require("./lib/models");
const log = require("./lib/log")
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;


configureApp();
connectDB();

// make schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    displayName: String
});

userSchema.plugin(passportLocalMongoose);

const bookSchema = new mongoose.Schema({
    authorName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    edition: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },
    path: String
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Google Strategy
passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/market",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/tokeninfo"
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({
            googleId: profile.id
        }, function (err, user) {
            return done(err, user);
        });
    }
));

//route user to the pages
app.get("/home", (req, res) => {
    res.render("home");
})

app.get('/logout', function (req, res) {
    req.logout();
    console.log("loggedout" + req.user);
    res.redirect('/');
});

app.route("/welcome")
    .get(function (req, res) {
        res.render("welcome");
    })
// conbine the top with this one as 1 ****
app.get("/", (req, res) => {
    res.render("home");
})

// register route
app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })
    .post(function (req, res) {
        User.register({
            username: req.body.username,
            displayName: req.body.displayName
        }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.render("welcome");
                });
            }

        });
    })

// login route
app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {

        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        req.login(user, function (err) {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("market");
                });
            }
        });
    });

// go to market
app.get("/market", (req, res) => {
    Book.find({}, function (err, books) {
        res.render("market", {
            books: books
        });
    });
})

// sell 
app.get("/sell", (req, res) => {
    // validate if user is logined in
    res.render("sell");
})

//Clear list
app.get("/clear", (req, res) => {

    res.redirect("/");
});


// File upload
app.post("/uploadfile", upload.single("imageFile"), function (req, res) {
    const authorName = req.body.author;
    const title = req.body.title;
    const isbn = req.body.isbn;
    const price = req.body.price;
    const edition = req.body.edition;
    const publisher = req.body.publisher;
    const course = req.body.course;
    const uploadDate = new Date();
    // const comments = req.body.miscComments;
    const file = req.file;

    // ** If file is empty then assign default image as path:key **
    if (!file) {
        return log.error("Please upload a file!");
    } else {
        const book = new Book({
            authorName: authorName,
            title: title,
            isbn: isbn,
            price: price,
            edition: edition,
            publisher: publisher,
            course: course,
            date: uploadDate,
            path: file.filename
        });

        book.save(function (err) {
            if (!err) {
                res.redirect("/market");
            } else {
                console.log("erroor");
            }
        });
    }
})

// Google authentication route
app.get("/auth/google",
    passport.authenticate("google", {
        scope: ["profile"]
    }))

app.get("/auth/google/market",
    passport.authenticate("google", {
        failureRedirect: "/login"
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/welcome');
        return (res.redirect("/market"));
    });



app.listen(process.env.PORT || 8080, function () {
    console.log(`Server start at ${process.env.PORT}`);
});