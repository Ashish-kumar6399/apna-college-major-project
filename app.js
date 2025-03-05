const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path =require('path');
const methodOverride = require('method-override');
const { log } = require('console');
app.use(methodOverride('_method'));
const ejsMate =require('ejs-mate');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
 const ExpressError = require("./utils/ExpressError.js")
 const  wrapAsync = require("./utils/wrapAsync.js")
 const {listingSchema} =require("./schema.js");

main()
    .then( () => {
        console.log("Connected to the db server");
    })
     .catch((err)=>{
        console.log(err);
     });

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use (express.urlencoded({ extended: true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

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

app.get("/", function(req, res){
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

app.get("/listings", async( req, res) => {
   const allListings =  await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});


// New Route
app.get("/listings/new", function(req, res){
    res.render("listings/new.ejs");
});

// show Route
    
app.get("/listings/:id", async(req, res) => {
    let {id} =req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
     const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});


// Create Route
app.post("/listings",validateListing,wrapAsync, (async(req, res,next) => {
     const newListing =new Listing(req.body.listing);
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
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing} );
    res.redirect(`/listings/${id}`);
})
);

// Delete Route
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
   let deletdListing =  await Listing.findByIdAndDelete(id);
    console.log(deletdListing);
    res.redirect('/listings');
});


app.all("*",(req,res,next)=>{
    next(new ExpressError( 404, "page not found"));
});

app.use((err, req, res, next) => {
   let {statuscode = 500,message="something went wromg"} = err;
   res.render("error.ejs",{message: err.message,err})
});



app.listen( 8080, () => {
    console.log('Server is running on port 8080');
});