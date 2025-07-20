require('dotenv').config();

const Listing = require("../models/listing.js");

// import { query } from 'express';
const mapToken = process.env.MAP_TOKEN;
// const geocodingClient=mbxGeocoding({accessToken:mapToken});
// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// }

module.exports.index = async (req, res) => {
  const { category } = req.query;
  let allListings;

  if (category) {
    // Find listings that include the category in their array
    allListings = await Listing.find({ category: category });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index.ejs", { allListings, category: category || "All" });
};



module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs", { listing: {} });
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.createListing = async (req, res, next) => {
  try {
    const { geocoding, config } = await import('@maptiler/client');
    config.apiKey = process.env.MAP_TOKEN; // ✅ Set your MapTiler API key

    const userLocation = req.body.listing.location;
    console.log("User Location:", userLocation);

    // Get coordinates from location string
    const geoResponse = await geocoding.forward(userLocation, { limit: 1 });

    let coordinates = null;
    if (geoResponse.features.length > 0) {
      coordinates = geoResponse.features[0].geometry.coordinates;
      console.log("✅ Coordinates:", coordinates);
    } else {
      console.log("⚠️ No coordinates found for the location.");
    }

    // Handle image and listing creation
    let url = req.file?.path || '';
    let filename = req.file?.filename || '';

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    
      newListing.geometry = {
        type: "Point",
        coordinates: coordinates // [longitude, latitude]
      };
    

    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings");

  } catch (err) {
    console.error("❌ Error in createListing:", err.message);
    req.flash("error", "Failed to create listing. Please try again.");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image && listing.image.url
        ? listing.image.url.replace("/upload", "/upload/w_250")
        : null;
    res.render("listings/edit.ejs", { listing, originalImageUrl })
}


module.exports.updateListings = async (req, res) => {
    let { id } = req.params;

    const { geocoding, config } = await import('@maptiler/client');
    config.apiKey = process.env.MAP_TOKEN;

    // Get new location string
    const newLocation = req.body.listing.location;

    // Get coordinates from updated location
    const geoResponse = await geocoding.forward(newLocation, { limit: 1 });

    let coordinates = null;
    if (geoResponse.features.length > 0) {
        coordinates = geoResponse.features[0].geometry.coordinates;
    }

    // Update listing
    let listing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
        ...(coordinates && {
            geometry: {
                type: "Point",
                coordinates: coordinates
            }
        })
    });


    // If a new image was uploaded, update the image field
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// module.exports.searchListings = async (req, res) => {
//   const query = req.query.query?.trim(); // get search term
//   console.log("🔍 Search Query:", query); // 🔍 DEBUG

//   if (!query) {
//     req.flash("error", "Please enter a search term.");
//     return res.redirect("/listings");
//   }

//   try {
//     const listings = await Listing.find({
//       $or: [
//         { title: { $regex: query, $options: "i" } },
//         { location: { $regex: query, $options: "i" } }
//       ]
//     });

//     res.render("listings/index.ejs", { allListings: listings, query });
//   } catch (err) {
//     console.error("❌ Search Error:", err);
//     req.flash("error", "An error occurred during search.");
//     res.redirect("/listings");
//   }
// };
// controllers/listings.js
module.exports.searchListings = async (req, res) => {
  const query = req.query.query?.trim(); // get search term
  const category = req.query.category?.trim(); // 🆕 get category
  console.log("🔍 Query:", query, "| Category:", category); // 🔍 DEBUG

  let filter = {};

  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } }
    ];
  }

  if (category) {
    filter.category = category;
  }

  try {
    const listings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings: listings, query, category });
  } catch (err) {
    console.error("❌ Search Error:", err);
    req.flash("error", "An error occurred during search.");
    res.redirect("/listings");
  }
};



module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
}