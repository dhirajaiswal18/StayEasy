const Listing = require("../models/listing");

//Index route
module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
 };



 // Search route
module.exports.searchListings = async (req, res) => {
    try {
      // Extract search parameters from query
      const { price, country } = req.query;
  
      // Build the filter object dynamically based on user input
      const filter = {};
      if (price) {
        filter.price = { $lte: parseInt(price) }; // Match listings with price <= user input
      }
      if (country) {
        filter.country = new RegExp(country, "i"); // Case-insensitive search for country
      }
  
      // Query the database for matching listings
      const listings = await Listing.find(filter);
  
      // Render the results on the listings page
      res.render("listings/index.ejs", { allListings: listings }); // Pass filtered listings to the same view
    } catch (error) {
      console.error("Error fetching search results:", error);
      res.status(500).send("An error occurred while searching for listings.");
    }
  };



 //NEW route
 module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs") 
 };

  //show Route
  module.exports.showListing = async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews",
       populate: {
           path: "author",
       },
     })
    .populate("owner");
    if(!listing) {
       req.flash("error", "Listing you requested for does not exist!");
       res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


//create route
module.exports.createListing = async (req, res, next) => {
    // let {title, description, image, price, country, location} = req.body;
      let url = req.file.path;
      let filename = req.file.filename;
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url, filename};
      await newListing.save();
      req.flash("success", "New Listing Created!");
      res.redirect("/listings");
};

//edit route
module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
     }
    res.render("listings/edit.ejs", { listing });
};

//Update route
module.exports.updateListing = async (req,res) => {
   
    let {id} = req.params;
   let listing = await  Listing.findByIdAndUpdate(id, {...req.body.listing});
 
   if( typeof req.file !== "undefined"){ 
   let url = req.file.path;
   let filename = req.file.filename;
   listing.image = { url, filename};
   await listing.save();
   }
   req.flash("success", "Listing Updated!");
   res.redirect(`/listings/${id}`);
};


//Delete Route
module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};


