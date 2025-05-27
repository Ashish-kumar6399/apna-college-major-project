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
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
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

   let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
   if(typeof req.file !== 'undefined' && req.file !== null) {
    // If a new file is uploaded, update the image field
    // Assuming req.file contains the uploaded file information
    // and listing.image is an object with url and filename properties
    id = id.trim(); // Trim any leading or trailing whitespace
   
   let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename }; 
    await listing.save();
    }
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