const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');

const MONGO_URL = "mongodb+srv://ashishkumar541712:3gFIXd3wnzxIBzdJ@cluster0.0vis0.mongodb.net/wandrlust?retryWrites=true&w=majority&appName=Cluster0";

const ExpressError = require("./utils/ExpressError.js")


const listings =require("./routes/listing.js")
const reviews = require("./routes/review.js")

main()
    .then(() => {
        console.log("Connected to the db server");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.get("/", function (req, res) {
    res.send("hi i am roott");
});






app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);








app.get('/db', async (req, res) => {
    console.log("db")
    res.json({ msg: "hello" })
})

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "something went wromg" } = err;
    res.render("error.ejs", { message: err.message, err })
});



app.listen(8080, () => {
    console.log('Server is running on port 8080');
});