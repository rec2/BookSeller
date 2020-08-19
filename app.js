const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer');

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));
app.set("view engine", "ejs");

// set connection and/or new DB
mongoose.connect("mongodb://localhost:27017/booksDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const upload = multer({
    storage: storage
})

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
        required: true
    },
    // date : { ***add this later
    //     type: date,
    //     required: true
    // },
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
    // const uploadDate = Date();
    // const comments = req.body.miscComments;
    const file = req.file;
 
    // ** If file is empty then assign default image as path:key **

    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    } else {
        const book = new Book({
            authorName: authorName,
            title: title,
            isbn: isbn,
            price: price,
            edition: edition,
            publisher: publisher,
            course: course,
            path : file.filename
        });

        book.save(function(err){
            if(!err){
                res.redirect("/market");
            } else {
                console.log(err);
            }
        });
    }
})


// set lisenter for port
app.listen(3000, function () {
    console.log("Server started on port ")
})