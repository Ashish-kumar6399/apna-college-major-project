const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js")
const wrapAsync = require("../utils/wrapAsync.js")
const {  reviewSchema } = require("../schema.js");
const Review = require("../models/review.js")
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewsController = require("../controllers/reviews.js")


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};


// Review Route
//post Route
router.post("/", isLoggedIn, validateReview,  wrapAsync(reviewsController.createReview));


// Delete Review Route
router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewsController.destroyReview));


module.exports = router;