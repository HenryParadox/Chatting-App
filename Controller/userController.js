const express = require("express");
const app = express();
const User = require("../Model/userModel");
const Chat = require("../Model/chatModel");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const loadRegister = async (req, res, next) => {
  try {
    res.render("register.ejs");
  } catch (error) {
    console.log("Oops, there are some error in Registration load : " + error);
    next(error);
  }
};

const userRegister = async (req, res, next) => {
  try {
    const data = req.body;
    const link = await `${process.env.APP_BASE_URL}/get/${req.filename}`;
    data.image = link;
    const userEmail = req.body.email;
    const findUser = await User.findOne({ email: userEmail });
    if (findUser) {
      throw new Error("User is already registered with this e-mail address.");
    }
    const addUser = new User(data);
    const token = jwt.sign(
      {
        user_id: addUser._id,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "12h",
      }
    );

    const createdDate = new Date().toISOString();
    addUser.createdDate = createdDate;

    addUser.token = token;

    await addUser.save();
    const savedUser = await User.findOne({ email: userEmail });

    res.render("register.ejs", {
      message: "Your registration has been completing!",
    });
  } catch (error) {
    console.log("Oops, there are some error in Registration: " + error);
    next(error);
  }
};

const loadLogin = async (req, res, next) => {
  try {
    res.render("login");
  } catch (error) {
    console.log("Oops, there are some error in load Login : " + error);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const findUser = await User.findOne({
      email: userEmail,
      password: userPassword,
    });
    if (!findUser) {
      throw new Error("User not found, Please registered");
    }
    if (findUser) {
      req.session.user = findUser;
      res.redirect("/dashBoard");
    }
    const token = jwt.sign(
      {
        user_id: findUser._id,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: "12h",
      }
    );
    let data = await findUser.email;
    let result = await User.updateOne(
      { email: { $eq: data } },
      {
        $set: {
          token: token,
        },
      }
    );
    const updatedUser = await User.findOne({
      email: userEmail,
      password: userPassword,
    });
  } catch (error) {
    console.log("Oops, there are some error in Login: " + error);
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    console.log("Oops, there are some error in Logout : " + error);
    next(error);
  }
};

const loadDashboard = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.session.user._id } });
    res.render("dashBoard", { user: req.session.user, users: users });
  } catch (error) {
    console.log("Oops, there are some error in load Dash Board : " + error);
    next(error);
  }
};
const isLogin = async (req, res, next) => {
  try {
    if (req.session.user) {
    } else {
      res.redirect("/login");
    }
    next();
  } catch (error) {
    console.log("Oops, there are some error in check login : " + error);
    next(error);
  }
};
const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/dashBoard");
    }
    next();
  } catch (error) {
    console.log("Oops, there are some error in check logout : " + error);
    next(error);
  }
};

const saveChat = async (req, res, next) => {
  try {
    const userChat = new Chat({
      sender_id: req.body.sender,
      receiver_id: req.body.receiver,
      message: req.body.message,
    });
  } catch (error) {
    console.log("Oops, there are some error in save chat : " + error);
    next(error);
  }
};

module.exports = {
  loadRegister,
  userRegister,
  loadLogin,
  loginUser,
  loadDashboard,
  logoutUser,
  isLogout,
  isLogin,
  saveChat,
};
