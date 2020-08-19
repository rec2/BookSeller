const passportLocalMongoose = require("passport-local-mongoose");
const {configureApp, app} = require("./app-configure");
const {connectDB, mongoose, upload } = require("./connect-mongo.js");
const log = require("./log.js");

configureApp();
connectDB();

// make schema
const bookSchema = {
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
};


// items model (db) 
const Book = mongoose.model("Book", bookSchema);

//route user to the pages
app.get("/home", (req, res) => {
    res.render("home");
})
// conbine the top with this one as 1 ****
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/market", (req, res) => {
    Book.find({}, function (err, books) {
        res.render("market", {
            books: books
        });
    });
})

app.get("/sell", (req, res) => {
    res.render("sell");
})

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

    if (false) {
        error.httpStatusCode = 400;
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
                info.error(err);
            }
        });
    }
})


// set lisenter for port
app.listen(3000, log.info("Server started on port " + 3000));