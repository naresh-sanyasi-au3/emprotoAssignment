const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const createToken = (user) => {
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: "7d" });
};
module.exports.creatUserValidation = [
  body("name").not().isEmpty().trim().withMessage("name is required"),
  // body('email').isEmail().withMessage("please enter correct email"),
  body("email")
    .not()
    .isEmpty()
    .isEmail()
    .trim()
    .withMessage("email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be 6 character"),
];

module.exports.creatUser = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ errors: [{ msg: "email is already exist" }] });
    }
    //   hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
      const user = await User.create({
        name,
        email,
        password: hash,
      });
      const token = createToken(user);

      return res.status(200).json({ msg: "user has been created", token });
    } catch (error) {
      return res.status(400).json({ errors: errors.array() });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.loginValidation = [
  body("email")
    .not()
    .isEmpty()
    .isEmail()
    .trim()
    .withMessage("email is required"),
  body("password").not().isEmpty().withMessage("password is required"),
];

module.exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const matched = await bcrypt.compare(password, user.password);
      if (matched) {
        const token = createToken(user);
        return res
          .status(200)
          .json({ msg: "you have login successfully", token });
      } else {
        return res
          .status(401)
          .json({ errors: [{ msg: "password is not correct" }] });
      }
    } else {
      return res.status(404).json({ errors: [{ msg: "user not found" }] });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

module.exports.fetchUsers = async (req, res) => {
  try {
    const user = await User.find();
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(401).json({ errors: [{ msg: "no user created" }] });
    }
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
