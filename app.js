const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const { json } = require("body-parser");
const app = express();
const port = 3000;

// market array
let marketBooks = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//route user to the pages
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.get("/market", (req, res) => {
    res.sendFile(__dirname + "/public/market.html");
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
        course: course,
        // comments = req.body.miscComments,
    }

    jsonData = JSON.stringify(book);
    // marketBooks.push(jsonData);
    
    // res.send(jsonData);
    // FIGURE OUT HOW TO SEND DATA TO BE DISPLAYED IN MARKET BOARD
    res.on("data", data => {
        console.log(data);
    })


})
// set lisenter for port
app.listen(port, (req,res) => {
    console.log("Server up and running at http://localhost: " + port);
})
