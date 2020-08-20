const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

// make schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    displayName: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

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

const Book = mongoose.model("Book", bookSchema);
const User = mongoose.model("User", userSchema);



module.exports = {
    Book: Book,
    User: User
}