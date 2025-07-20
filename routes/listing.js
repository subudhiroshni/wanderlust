const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage})


router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('image'),validateListing, wrapAsync(listingController.createListing)); 

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm)
router.get("/search",listingController.searchListings);
// router.get("/", async (req, res) => {
//   const { category } = req.query;

//   let allListings;
//   if (category) {
//     allListings = await Listing.find({ category });
//   } else {
//     allListings = await Listing.find({});
//   }

//   res.render("listings/index", { allListings });
// });
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner,upload.single('image'), validateListing, wrapAsync(listingController.updateListings))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//show route
// router.get("/:id", wrapAsync(listingController.showListing))

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

//update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListings))

//delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

module.exports = router;