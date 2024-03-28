if (process.env.NODE_ENV != "production") {
  require("dotenv").config(); // after setting the cloudinary we need this library setup
}
// console.log(process.env.SECRET); // remove this after you've confirmed it is working

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//  Now we will use the Mongo atlas url
const dbUrl = process.env.ATLASDB_URL;

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

main()
  .then(() => {
    console.log("Connected to DB  check krr haa check krr ");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  // await mongoose.connect(MONGO_URL); // now we will use the atlas db url
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // for parsing the data
app.use(methodOverride("_method"));
// to use ejs mate we need this ->
app.engine("ejs", ejsMate);

//  Now to use static files - public-> css etc
app.use(express.static(path.join(__dirname, "/public")));

// Mongo session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});


store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //This is used for security perposes generally.
  },
};

// app.get("/", (req, res) => {
//   res.send("Halloo, this is our root base hihihi hahaha ");
// });




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // user related information  when stored is called serialize, so that we dont have to login again and again.
passport.deserializeUser(User.deserializeUser());

//  Flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  // console.log(res.locals.success);
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // this info is stored in req.user so that we can embedd it in ejs file, since ejs file directly cant use req.user property so.
  next();
});

//  Demo user route -> Authentication, using this request, we will create a new user
// app.get("/demouser", async (req,res)=>{
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "khusrav-student"
//   });   // register is a static method, we will use it here to save this fakeUser
//    let registeredUser = await User.register(fakeUser,"Good morning Boksaaa amarrr");
//    res.send(registeredUser);
// })

app.use("/listings", listingRouter); // because of thus line ,middleware we are able  to access the listing.js file which is inside the router folder.
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// For page not found - that is all route other than the above routres, only if that doesnt match
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page is not Found  :( "));
});

// to handle an error - we use a middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Uushh! Something broke :(" } = err;
  // res.send("Something seems to be wrong ohhh nooo!!!");
  //   res.status(statusCode).send(message);  // use this insetad of  the above
  //  For, now lets comment out the above code
  res.status(statusCode).render("error.ejs", { message });
});
app.listen(8080, () => {
  console.log("Server is listening to our port 8080 ");
});
