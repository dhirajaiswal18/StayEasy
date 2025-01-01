const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { route } = require("./user.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



// Import all controller methods, including `searchListings`
const {
  index,
  renderNewForm,
  createListing,
  showListing,
  renderEditForm,
  updateListing,
  destroyListing,
  searchListings,
} = listingController;

//ROUTES
// Search Route
router.get("/search", wrapAsync(searchListings)); // Use the controller function


// Filter Listings by Tags Route (Add it here)
// router.get('/filter', async (req, res) => {
//   try {
//     const { tag } = req.query; // Get the tag from the query string
//     const listings = await Listing.find({ tags: tag }); // Filter listings by the tag
//     res.render('listings/index', { listings }); // Render filtered listings
//   } catch (err) {
//     console.error(err);
//     res.redirect('/listings');
//   }
// });





//listing CRUD ROUTES
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
     isLoggedIn, 
     upload.single("listing[image]"),
     validateListing ,
     wrapAsync(listingController.createListing)
    );



    //NEW route
 router.get("/new", isLoggedIn, listingController.renderNewForm);
 
    router
    .route("/:id")
    .get( wrapAsync(listingController.showListing) )
    .put(
      isLoggedIn,
      isOwner, 
      upload.single("listing[image]"),
      validateListing ,
      wrapAsync(listingController.updateListing))
    .delete( isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



    
//index route
// router.get( "/",  wrapAsync(listingController.index));
 
 
 
 //show Route
//  router.get("/:id", wrapAsync(listingController.showListing) );

 
//create route
// router.post("/", isLoggedIn, validateListing ,wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//Update route
// router.put("/:id", isLoggedIn,isOwner, validateListing ,wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
//

// search Route
router.get('/search', async (req, res) => {
  try {
      const { price, country } = req.query;
      let filter = {};

      if (price) {
          filter.price = { $lte: parseInt(price) }; // Listings with price less than or equal to `price`
      }

      if (country) {
          filter.country = new RegExp(country, 'i'); // Case-insensitive search for country
      }

      const listings = await Listing.find(filter);
      res.render('listings/index', { listings }); // Render search results
  } catch (err) {
      console.error(err);
      res.redirect('/');
  }
});



module.exports = router;
