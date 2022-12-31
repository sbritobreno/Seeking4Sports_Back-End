const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const default_user_img = "../public/images/profile_img_default.png";
const User = require("../models/User");

// helpers
const getUserByToken = require("../helpers/get-user-by-token");
const getToken = require("../helpers/get-token");
const createUserToken = require("../helpers/create-user-token");
const { imageUpload } = require("../helpers/image-upload");

module.exports = class UserController {
  static async register(req, res) {
    const name = req.body.name;
    const username = req.body.username;
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
    } else if (password.length < 8) {
      res.status(422).json({
        error: "Password must be at least 8 characters!",
      });
      return;
    }

    if (!confirmpassword) {
      res.status(422).json({ message: "Password confirmation is needed" });
      return;
    }

    if (password != confirmpassword) {
      res.status(422).json({
        message: "Password and password confirmation have to be the same!",
      });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ where: { email: email } });

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
      res.status(422).json({ message: "You need to type your email!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "You need to type your password!" });
      return;
    }

    // check if user exists
    const user = await User.findOne({ where: { email: email } });

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

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser

    if (req.headers.authorization) {
      const token = getToken(req)
      const decoded = jwt.verify(token, 's4ssecret')

      currentUser = await User.findByPk(decoded.id)
      currentUser.password = undefined
    } else {
      currentUser = null
    }

    res.status(200).send(currentUser)
  }

  static async getUserById(req, res) {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(422).json({ message: "User not found!" });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    let image = "";
    if (req.file) {
      image = req.file.filename;
    }

    // validations
    if (!name) {
      res.status(422).json({ message: "Name is needed!" });
      return;
    }
    user.name = name;

    if (!phone) {
      res.status(422).json({ message: "Phone is needed!" });
      return;
    }
    user.phone = phone;

    // Username and Email are set to not be changed on the front-end

    if (image) {
      const imageName = req.file.filename;
      user.image = imageName;
    } else {
      user.image = default_user_img;
    }

    // check if password match
    if (password != confirmpassword) {
      res.status(422).json({
        error: "Password and password confirmation have to be the same!",
      });
    } else if (password.length < 8) {
      res.status(422).json({
        error: "Password must be at least 8 characters!",
      });
    } else if (password == confirmpassword) {
      // creating new password
      const salt = await bcrypt.genSalt(12);
      const reqPassword = req.body.password;
      const passwordHash = await bcrypt.hash(reqPassword, salt);
      user.password = passwordHash;
    }

    try {
      // returns updated data
      user.save();
      res.json({
        message: "User details updated!",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async deleteUserAccount(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    // Delete user in the database
    try {
      await User.destroy({ where: { id: user.id } });
      res.json({
        message: "User deleted!",
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async resetUserPassword(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    const email = req.body.email;

    // validations
    if (!email) {
      res
        .status(422)
        .json({ message: "Email is needed in order to reset password!" });
      return;
    }
    user.email = email;

    // check if user exists
    const user_exists = await User.findOne({ where: { email: email } });

    if (!user_exists) {
      return res
        .status(422)
        .json({ message: "There is no user with this email!" });
    }

    // Create provisional password and send it to user's email
    function getRandom() {
      return Math.floor(
        Math.pow(10, 8 - 1) + Math.random() * 9 * Math.pow(10, 8 - 1)
      );
    }
    const salt = await bcrypt.genSalt(12);
    const newPassword = getRandom();
    const passwordHash = await bcrypt.hash(newPassword, salt);
    user.password = passwordHash;

    // Send newPassword to user's email
    // To be implemented
  }
};
