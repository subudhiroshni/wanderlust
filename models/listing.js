
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: String,
        // url: {
        //     type: String,
        //     default: "https://media.istockphoto.com/id/825319778/photo/sunset-on-beach.jpg?s=612x612&w=is&k=20&c=5jtkk5yhyjrnIY9P8ReXuKP9GOXU21NFjFfXUxvbDnM=",
        //     set: (v) => v === "" ? "https://media.istockphoto.com/id/825319778/photo/sunset-on-beach.jpg?s=612x612&w=is&k=20&c=5jtkk5yhyjrnIY9P8ReXuKP9GOXU21NFjFfXUxvbDnM=" : v
        // }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
    type: [String],
    enum: [
      "Trending",
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Arctic",
      "Domes",
      "Boats"
    ],
    required: true
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
