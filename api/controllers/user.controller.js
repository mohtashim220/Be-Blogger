import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import { verifyToken } from "../utils/verifyUser.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "Hello from server",
  });
};

export const updateUser = async (req, res, next) => {
  console.log("update api is called");
  console.log("user id ", req.user.userId);
  console.log("params id ", req.params.id);
  if (req.user.userId !== req.params.id) {
    return next(errorHandler(401, "you can update your own account only!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest );
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req,res,next) => {
  console.log("delete api is called");
  if (req.user.userId !== req.params.id) {
    return next(errorHandler(401, "you can delete your own account only!"));
  }
  else {
    try {
      await User.findByIdAndDelete(req.params.id)
      res.clearCookie("access_token");
      res.status(200).json({ message: 'user has been deleted...' });
      
    } catch (error) {
      next(error);
    }
  }
};

export const getUserListings = async (req, res, next) => {
   console.log("getUserListing api is called");
   if (req.user.userId !== req.params.id) {
     return next(errorHandler(401, "you can view your own listing only!"));
   }
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    console.log(listings)
    res.status(200).json(listings);
    
  } catch (error) {
    
  }
  

};



