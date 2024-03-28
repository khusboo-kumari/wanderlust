const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userControleer = require("../controllers/users.js");

//  USING ROUTER.ROUTE CONCEPT TO COMPACT THE ROUTES CODE 
router.route("/signup")
.get(userControleer.renderSignupForm)
.post(wrapAsync(userControleer.signup)
)

//  Similarly, router.route code for "/login also" 
router.route("/login")
.get(userControleer.renderLoginForm)
.post(
  saveRedirectUrl, // calling our middleware here 
  passport.authenticate("local", {
    failureRedirect: "/login",  
    failureFlash: true,
  }),
  userControleer.login
);

//  Now we can remove as we already use router.routes
// router.get("/signup", userControleer.renderSignupForm);

// POST method, asynchronous because we are supposed  to make changes in the database.
//  Now we can remove as we already use router.routes
// router.post(
//   "/signup",
//   wrapAsync(userControleer.signup)
// );


//  Now we can remove as we already use router.routes
// router.get("/login",userControleer.renderLoginForm);


//  Now we can remove as we already use router.routes
// router.post(
//   "/login",
//   saveRedirectUrl, // calling our middleware here 
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userControleer.login
// );
//  req.logout is an inbuilt method which takes a callback to itself 
router.get("/logout", userControleer.logout);

module.exports = router;
