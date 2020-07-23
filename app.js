const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(express.static("public"));

// market array
let marketBooks = [];

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

// get information from form and paste it in the marketboard}


app.post("/market", function(req,res) { 
    
    const authorName = req.body.author;
    const title = req.body.title;
    const isbn = req.body.isbn;
    const price = req.body.price;
    const edition = req.body.edition;
    const publisher = req.body.publisher;
    const course = req.body.course;
    const comments = req.body.miscComments;

    let book = {
        authorName: authorName,
        title: title,
        isbn: isbn,
        edition: edition,
        publisher: publisher,
        price: price,
        course: course,
        // comments = req.body.miscComments,
        // make options for img
    }

    marketBooks.push(book);
    

    // send added item to market.ejs 
    res.render("market", {newBook : marketBooks}); 
})

// set lisenter for port
app.listen(3000, function () {
    console.log("Server started on port " + 3000)
})