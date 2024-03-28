const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user); 
    // console.log(req.path, "..", req.originalUrl);  // if user is not loggedin then we need to save this path.  
    if (!req.isAuthenticated()) {
        // redirect url save 
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You have to logged in to manipulate listingggg");
        return  res.redirect("/login");   
    }
    next();  
}

//   To save our redirectUrl from being exploited by pasport, we have to use res.locals, so that it can be accessed withiut any issue.
module.exports.saveRedirectUrl = (req,res,next) =>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) { 
      req.flash("error", "You r not the owner"); 
      return res.redirect(`/listings/${id}`);
    }
    next(); // if u dont use next, our server will get stuck, throbbed .
}

module.exports.validateListing = (req,res,next)=>{
    // -> Now we will convert all the Joi validations part as a function using middleware
    let { error } = listingSchema.validate(req.body);
    if (error) {
      // Now, lets combile all the error properties, details objects, so to extract them ->
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  
}

module.exports.validateReview = (req,res,next)=>{
    //  For Reviews, server side validations 
    let {error} = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  
}

//  Middleware for protecting the reviews, such that only the author can delete that review
module.exports.isReviewAuthor = async (req,res,next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {  
      req.flash("error", " You didnt create this review ");  
      return res.redirect(`/listings/${id}`);
    }
    next(); // if u dont use next, our server will get stuck, throbbed .
}


