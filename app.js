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
    edition: String,
    publisher: String,
    path: String
};


// items model (db) 
const Book = mongoose.model("Book", bookSchema);

//route user to the pages
app.get("/", (req, res) => {
    res.render("home");
})

app.get("/market", (req, res) => {
    Book.find({}, function (err, books) {
        console.log(books[0]);
        res.render("market", {
          test: books
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
    // const edition = req.body.edition;
    // const publisher = req.body.publisher;
    // const course = req.body.course;
    // const image = req.file;
    // const comments = req.body.miscComments;
    const file = req.file;
    const body = req.body;
    // create a book with corresponding info

    // save book and add to collections
    // load book and corresponding filepath to market.ejs
    
    // if (!book) {
    //     console.log("THere is already in there")
    // } else {
    //         console.log(book._id)
    //     book.save(function (err) {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             console.log("done!" + Book.findById({id : "5f28827e5935343bc08843f8"}))
    //         }
    //     });
    // }
 
 
    // find array of books form database and display in newbook

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