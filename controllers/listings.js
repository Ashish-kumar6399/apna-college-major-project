const Listing = require("../models/listing");


module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    const listing = await Listing.findById(id).populate({ path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","listing you are requested is not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}


module.exports.createListing = (async (req, res) => {
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    console.log(newListing)
    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
})


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you are requested is not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}


module.exports.updateListing = async (req, res) => {
    
    let { id } = req.params; // ✅ FIXED

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully!");
    return res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Trim any leading or trailing whitespace
    let deletdListing = await Listing.findByIdAndDelete(id);
    console.log(deletdListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect('/listings');
}