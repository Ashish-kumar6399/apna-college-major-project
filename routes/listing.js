const express = require("express");
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const {isLoggedIn,isOwner} =require("../middleware.js")
const listingController =require("../controllers/listings.js")
const multer = require("multer");
 const { cloudinary, storage } = require('../cloudconfig.js');
const upload = multer({storage});

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};





router
.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));
   
    
// New Route
router.get("/new",isLoggedIn ,listingController.renderNewForm );


router
   .route("/:id")
   .get(wrapAsync(listingController.showListing))
   .put( isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))
   .delete( isLoggedIn,isOwner,wrapAsync (listingController.destroyListing));


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

module.exports = router;
