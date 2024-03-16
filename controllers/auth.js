import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {

  console.log("register");
  const { username, email, password, cpassword } = req.body;

  if (!username || !email || !password || !cpassword) {
    return next(createError(422, "Please fill all fields!"));
  }
  else {
    try {
      const userExist = await User.findOne({ email: email });
      const usernameExist = await User.findOne({ username: username });
      console.log(email, userExist);
      console.log(username, usernameExist);
      if (userExist) {
        return next(createError(422, "Email already exists!"));
      } else if (usernameExist) { return next(createError(404, "User not found!")); }
      else if (password != cpassword) {
        return next(createError(422, "Password and Confirm Password are not matching!"));
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
          ...req.body,
          password: hash,
          cpassword: hash,
        });

        await newUser.save();
        res.status(200).send("User has been register Successfully.");
      }
    }
    catch (err) {
      next(err);
    }
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log("user._doc", user);
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    //console.log(isPasswordCorrect);
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ userdetails: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
