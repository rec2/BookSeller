const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require('multer');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set("view engine", "ejs");

// set connection and/or new DB
mongoose.connect("mongodb://localhost:27017/BookDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  var upload = multer({ storage: storage })
// make schema
const bookSchema = {
    // authorName : {
    //     type: String,
    //     required: true   
    // },
    // title : {
    //     type: String,
    //     required: true   
    // },
    // isbn : {
    //     type: Number,
    //     required: true   
    // },
    // price : {
    //     type: Number,
    //     required: true   
    // },
    // edition : String,
    // publisher : String
    image : {}
 
};


// items model (db) 
const Book = mongoose.model("Book", bookSchema);

//route user to the pages
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.get("/market", (req, res) => {
    res.sendFile(__dirname + "/public//market.html");
})

app.get("/sell", (req, res) => {
    res.sendFile(__dirname + "/public/sell.html");

})

app.post("/uploadfile", upload.single("myFile"), function(req,res) {

    const authorName = req.body.author;
    const title = req.body.title;
    const isbn = req.body.isbn;
    const price = req.body.price;
    const edition = req.body.edition;
    const publisher = req.body.publisher;
    const course = req.body.course;
    const image = req.file;
    const comments = req.body.miscComments;
    const file = req.file;
    
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    } else {
        res.render("market", {test : file.filename});

    }
})


// set lisenter for port
app.listen(3000, function () {
    console.log("Server started on port " + 3000)
})