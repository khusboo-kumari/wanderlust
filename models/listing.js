const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); 

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
    // type: String,
    // default:
    //   "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",

    //   validate: {
    //     validator: function(v) { // myself wala 
    //       // Validate that 'v' is either a string or an object with 'url' property
    //       return typeof v === "string" || (typeof v === "object" && typeof v.url === "string");
    //     }, 
    //     message: props => `${props.value} is not a valid image URL or object with 'url' property`
    //   },  

  //   set: (v) =>  // shraddha dd wala 
  //     v === ""
  //       ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  //       : v,
  // },
  // set: function(v) {
  //   // If 'v' is an object, extract the 'url' property
  //   if (typeof v === "object" && v.url) {
  //     return v.url;
  //   }
  //   // Otherwise, return 'v' as it is (string)
  //   return v;
  // }
},
  price: Number,
  location: String,
  country: String,
  reviews:[  // This is for 1 to many Relationship 
    {
      type: Schema.Types.ObjectId,
      ref:"Review" // for reference, Review Model 
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref:"User", 
  },

  //  for geocoding Map -> MapBox 
   geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      },
     },
    //  category:{
    //    type: String,
    //    enum: ["mountains",]
    //  }
});

// HANDLING: DELETE LISTING such that the related reviews also get deleted
listingSchema.post("findOneAndDelete",async(listing)=>{   // listing k data ->"listing"
     if (listing) {
         await Review.deleteMany({ _id: {$in: listing.reviews}}); // Hence, this is a mongoose middleware 
     }
});    


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
