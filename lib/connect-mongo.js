const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({
    storage: storage
});

function connectDB() {
    const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.numyi.gcp.mongodb.net/bookDB`;
    mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    mongoose.set("useCreateIndex", true);
    console.log("Connected to DB at " + URI)
};

module.exports.connectDB = connectDB;
module.exports.mongoose = mongoose;
module.exports.upload = upload;
module.exports.storage = storage;