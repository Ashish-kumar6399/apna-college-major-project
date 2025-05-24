const Listing = require('../models/listing');
const Review = require('../models/review');
const ExpressError = require("../utils/ExpressError.js")


module.exports.createReview =async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    console.log(newReview)
    await listing.save();

    console.log("new Review added");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}