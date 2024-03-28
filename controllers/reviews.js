const Listing = require("../models/listing");
const Review = require("../models/review");

// POST REVIEW ROUTE 
module.exports.createReview = async (req, res) => {
    //  passing validateReview as a middleware
    //  console.log(req.params.id);
    let listing = await Listing.findById(req.params.id); // wrapAsync is for basic error handling
    let newReview = new Review(req.body.review); 
    newReview.author = req.user._id;  //  Storing the author of the review 
    listing.reviews.push(newReview); //reviews is our array which we had defined in the listing.js, basically  pushing the new review 
    await newReview.save();
    await listing.save();
    // res.send("new review saved ");
    req.flash("success", "New Review Added");
    res.redirect(`/listings/${listing._id}`);
}

//  Delete Review 
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //  to also delete the related id from the reviews Array only if it matches

    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " Review Deleted");
    res.redirect(`/listings/${id}`);
}