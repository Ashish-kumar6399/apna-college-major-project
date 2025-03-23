const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const { log } = require('console');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');

const MONGO_URL = "mongodb+srv://ashishkumar541712:3gFIXd3wnzxIBzdJ@cluster0.0vis0.mongodb.net/wandrlust?retryWrites=true&w=majority&appName=Cluster0";

const ExpressError = require("./utils/ExpressError.js")
const wrapAsync = require("./utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js")

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

// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing ({
//         title:"my new villa",
//         description: "This is a beautiful villa",
//         price: 100000,
//         location: "Mumbai",
//         country: "India",
//     });
//     await  sampleListing.save();
//     console.log("Listing saved");
//     res.send("Listing created");
// });

app.get("/", function (req, res) {
    res.send("hi i am roott");
});

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});


// New Route
app.get("/listings/new", function (req, res) {
    res.render("listings/new.ejs");
});

// show Route

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
});


// Create Route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    console.log(newListing)
    await newListing.save();
    res.redirect("/listings");
})
);



// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    const listing = await Listing.findById(id);

    res.render("listings/edit.ejs", { listing });
}
);

// Update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
);

// Delete Route
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    let deletdListing = await Listing.findByIdAndDelete(id);
    console.log(deletdListing);
    res.redirect('/listings');
});



// Review Route
//post Route
app.post("/listings/:id/reviews", validateReview,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new Review added");
    res.redirect(`/listings/${id}`);
}));


// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res) =>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))




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