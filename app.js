const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');
const session = require("express-session");
const flash = require('connect-flash');
const passport =require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




const MONGO_URL = "mongodb+srv://ashishkumar541712:3gFIXd3wnzxIBzdJ@cluster0.0vis0.mongodb.net/wandrlust?retryWrites=true&w=majority&appName=Cluster0";

const sessionOptions = {
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 *24 *60 *60 *1000,
        maxAge:7 *24 *60 *60 *1000,
        httpOnly:true,
    } 
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/demouser",async(req,res)=>{
    let fakeuser =new User({
        username:"ashishwaswdwswqsas",
        email:"ashish@gmail.com",
    })
    let registeredUser = await User.register(fakeuser,"ashish123");
    res.send(registeredUser);
})


const ExpressError = require("./utils/ExpressError.js")
const listingsRouter =require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

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






app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);








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