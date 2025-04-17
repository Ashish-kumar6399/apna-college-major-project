const Listing =require("./models/listing");
const Review = require("./models/review");
module.exports.isLoggedIn =(req,res,next) =>{
    console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        // redirect url
        req.session.redirectUrl =req.originalUrl;

        console.log(req.user)
        req.flash("error","you are must be Login");
        res.redirect("/login")
    }
    next();
}


module.exports.savedRedirectUrl =( req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =req.session.redirectUrl;
    }
 next();
}

module.exports.isOwner = async (req,res,next) =>{
    let { id } = req.params;
    let  listing  =  await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error","you have not permision to edit");
       return res.redirect(`/listings/${id}`)
    }
    next();
};


module.exports.isReviewAuthor = async (req,res,next) =>{
    let { id,reviewId } = req.params;
    let  review  =  await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","you have not permision to edit");
       return res.redirect(`/listings/${id}`)
    }
    next();
};
