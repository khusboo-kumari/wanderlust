const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' }); // instead use this above one


// Index Route
// router.get("/", wrapAsync(async(req,res)=>{  // this index function is our asynchronous function whose task is to render this listings
      
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// }
// ));


//  Instead lets write our index route like this using controllers.

//  Lets require our Controller now 
const listingController = require("../controllers/listings.js"); 

// TOPIC - USING ROUTE.ROUTES concept for route 
router
.route("/")
.get(wrapAsync(listingController.index))

.post(
  isLoggedIn,
  // validateListing,
  upload.single("listing[image]"),  // this multer will process the image image file to reqquest file data 
  validateListing, 
  wrapAsync(listingController.createListing) 
);
// .post(upload.single("listing[image]"),(req,res)=>{   // passing in the middleware for the usage of multer library for image 
//   res.send(req.file); 
// });

// New Route  
router.get("/new", isLoggedIn,listingController.renderNewForm); 

//  USING ROUTE.ROUTES concept for route  for id: also 
router.route("/:id")
.get(
  wrapAsync(listingController.showListing)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing, // means first we will validate, only then we will perform the other functions or job
  wrapAsync(listingController.updateListing)
) 
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroylisting)
);


//  Since , it is already defined in router.routes u can now remove this
// Index Route
// router.get(
//   "/",
//   wrapAsync(listingController.index) // index which was the asynchronous function in controller.js
// );




// SHOW ROUTE -> now removing it as we used  ROUTER.ROUTE
// router.get(
//   "/:id",
//   wrapAsync(listingController.showListing)
// );

//  Since , it is already defined in router.routes u can now  also  remove this
// Create route   
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

//  Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// UPDATE ROUTE  -> now removing it as we used  ROUTER.ROUTE
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing, // means first we will validate, only then we will perform the other functions or job
//   wrapAsync(listingController.updateListing)
// );

// Delete Route  -> now removing it as we used  ROUTER.ROUTE
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroylisting)
// );

module.exports = router;
