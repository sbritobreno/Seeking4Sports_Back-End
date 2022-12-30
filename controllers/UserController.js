const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const default_user_img = "../public/images/profile_img_default.png"
const User = require("../models/User");

// helpers
// const getUserByToken = require('../helpers/get-user-by-token')
// const getToken = require('../helpers/get-token')
const createUserToken = require('../helpers/create-user-token')
// const { imageUpload } = require('../helpers/image-upload')

module.exports = class UserController {

  static async register(req, res) {
    const name = req.body.name;
    const username = req.body.username
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    // validations
    if (!name) {
      res.status(422).json({ message: "Name is needed" });
      return;
    }

    if (!username) {
      res.status(422).json({ message: "Username is needed" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "Email is needed" });
      return;
    }

    if (!phone) {
      res.status(422).json({ message: "Phone is needed" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "Password is needed" });
      return;
    }

    if (!confirmpassword) {
      res
        .status(422)
        .json({ message: "Password confirmation is needed" });
      return;
    }

    if (password != confirmpassword) {
      res
        .status(422)
        .json({ message: "Password and password confirmation have to be the same!" });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ where: {email: email} });

    if (userExists) {
      res.status(422).json({ message: "This email is already taken!" });
      return;
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
      name: name,
      username: username,
      phone: phone,
      email: email,
      password: passwordHash,
      image: default_user_img,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
      console.log(req.body.eamil)
      res.status(422).json({ message: "You need to type your email!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "You need to type your password!" });
      return;
    }

    // check if user exists
    const user = await User.findOne({ where: {email: email} });

    if (!user) {
      return res
        .status(422)
        .json({ message: "There is no user with this email!" });
    }

    // check if password match
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ message: "Invalid password!" });
    }

    await createUserToken(user, req, res)
  }
};
