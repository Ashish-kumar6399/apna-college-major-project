const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
