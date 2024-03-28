const User = require("../models/user");
//  get signup 
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
} 

module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      // Now to loggedin just after signup ->>> 
      req.login(registeredUser, (err)=>{
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
       });
      } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs"); 
}

module.exports.login = async (req, res) => {
    req.flash("success","Welcome to me and myself ")
   //  res.redirect("/listings"); // instead we have to redirect it to the path or route which it was trying to access before, but yes only after login onlyyyy.
   let redirectUrl =  res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
      if (err) {
        return next(err);
      }
      req.flash("success","You are logged out now ^ ^ "); 
      res.redirect("/listings"); 
    })
}