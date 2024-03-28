const Listing = require("../models/listing");
//  Require the geocode
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// Also require our access token
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  // this index function is our asynchronous fun whose task is to render this listings
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Create a new Route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//  SHOW ROUTE
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      // nested populate
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  // console.log("Retrieved listing:", listing); // Add this line for debugging
  if (!listing) {
    req.flash(
      "error",
      "Listing is already deleted or doesnt exist hihihi hahahaha budhuuu "
    );
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

//    create route - post
module.exports.createListing = async (req, res, next) => {
  //   copy and paste the forward geocode here
   let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location, 
      limit: 1,
    })
    .send();
    // console.log(response.body.features[0].geometry); // Here, response.body.features, is where our coordinates are hidden.
    // res.send(" Done hihihihihi ");   
  // .then(response => { // i commented because instead of using .then, i have use await keyword also see see check hihihihihi
  //   const match = response.body;
  // });

  let url = req.file.path;
  let filename = req.file.filename;

  // console.log(url,"--", filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  //  add the geometry coordinates here 
  newListing.geometry = response.body.features[0].geometry ; 

  let savedListing =  await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

//    EDIT ROUTE
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash(
      "error",
      "Listing is already deleted or doesnt exist hihihi hahahaha budhuuu "
    );
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); // image blur or pixel change -> Image transformation -> Cloudinary
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Posts/Listings Updated");
  res.redirect(`/listings/${id}`);
};

//   DELETE LISTING
module.exports.destroylisting = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted");
  res.redirect("/listings");
};
