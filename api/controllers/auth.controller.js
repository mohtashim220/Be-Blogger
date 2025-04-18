import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';


export const signup = async (req, res,next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username:username, email:email, password:hashedPassword });
  await newUser.save()
    .then(() => {
      res.status(201).json("use created successfully");
    })
    .catch((err) => {
      next(err);
    });
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const validUser = await User.findOne({ email: email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'invalid password'));
    }
    console.log(validUser._id);
    const token = jwt.sign({ userId: validUser._id }, process.env.SECRET_KEY);
    console.log("token created", token);
    const { password: pass, ...rest } = validUser._doc;
    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  console.log("backend google api is called");
  try {
     
    const user = await User.findOne({ email: req.body.email })
    console.log(user)

    if (user) {
      console.log("user email found");
      console.log("user id : ", user.username)
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
      console.log("token", token)
      const { password: pass, ...rest } = user._doc;
      
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
     
      
    }
    else {
      console.log("user not found")
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo
      });
      console.log("detailed created ", newUser);
      await newUser
        .save()
        .then(() => {
          console.log("new user saved");
          console.log(newUser._id);
          const token = jwt.sign(
            { userId: newUser._id },
            process.env.SECRET_KEY
          );
          console.log("token:", token);
          console.log('user doc', newUser._doc);
          const { password: pass, ...rest } = newUser._doc;
          res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json(rest);
        })
        .catch((err) => {
          next(err);
        });
      
    }

  } catch (error) {
    next(error)
  }
  
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("user has been logged out successfully");
    
  } catch (error) {
    next(error);
  }
};