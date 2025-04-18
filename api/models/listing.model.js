import mongoose from "mongoose";


const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postBy: {
      type: String,
    },
    
     content: {
      type: String,
      required: true,
    },
     
    imagesURLs: {
      type: Array,
       
    },
    userRef: {
      type: String,
      required: true,
    },
     
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
