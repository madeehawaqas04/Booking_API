import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  try {
    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(req.body.password, salt);

    // const user = new User({
    //   ...req.body,
    //   password: hash,
    // });


    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req, res, next) => {
  try {

    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
// const users = query
// ? await User.find().sort({ _id: -1 }).limit(5)
// : await User.find();
export const getUsers = async (req, res, next) => {
  try {
    let limit = Number(req.query.limit);
    console.log("limit", limit);
    console.log("getUser");
    const users =
      req.query.limit ?
        await User.find().sort({ createdAt: -1 }).limit(limit) :
        await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export const getUersCount = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ count: userCount });
  }
  catch (err) { next(err); }
}