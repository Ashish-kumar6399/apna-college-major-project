const express = require("express");
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const {isLoggedIn,isOwner} =require("../middleware.js")



const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

//index route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});


// New Route
router.get("/new",isLoggedIn , (req, res) => {
    res.render("listings/new.ejs");
});

// show Route

router.get("/:id", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","listing you are requested is not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
});


// Create Route
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    console.log(newListing)
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
})
);



// Edit Route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you are requested is not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}
);

// Update Route
router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    
    let { id } = req.params; // ✅ FIXED

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    return res.redirect(`/listings/${id}`);
})
);

// Delete Route
router.delete('/:id', isLoggedIn,isOwner, async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    let deletdListing = await Listing.findByIdAndDelete(id);
    console.log(deletdListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect('/listings');
});


module.exports = router;
