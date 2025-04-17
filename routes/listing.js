const express = require("express");
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const {isLoggedIn,isOwner} =require("../middleware.js")
const listingController =require("../controllers/listings.js")


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
router.get("/", wrapAsync(listingController.index));


// New Route
router.get("/new",isLoggedIn ,listingController.renderNewForm );

// show Route

router.get("/:id",wrapAsync(listingController.showListing));


// Create Route
router.post("/", validateListing, wrapAsync(listingController.createListing)
);



// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

// Update Route
router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete('/:id', isLoggedIn,isOwner,wrapAsync (listingController.destroyListing));


module.exports = router;
