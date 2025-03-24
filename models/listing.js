const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: "default.jpg",
    },
    url: {
      type: String,
      default: "https://th.bing.com/th/id/OIP.YN1AZakZogz4zri3hVJXHAHaEK?rs=1&pid=ImgDetMain",
    },
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  location: String,
  country: String,
  reviews:[{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}})
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
