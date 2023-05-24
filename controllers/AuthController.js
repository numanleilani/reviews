const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util"); 
let login_token = "yip-json-login-token";
let cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
}
exports.Signup = async (req, res, next) => {
  try {
    let newUser = await new User(req.body);
    newUser = await newUser.save();
    let token = jwt.sign({ id: newUser._id }, login_token);
    res.cookie('jwt_review', token, cookieOptions)
    res.status(200).json({
      status: "success", 
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "failed!",
        message: "Please enter Email and Password",
      });
    }
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        status: "failed!",
        message: "No user with this email found!",
      });
    }
    console.log(process.env.LOGIN_TOKIN);
    let comp = await bcrypt.compare(req.body.password, user.password);
    if (!comp) {
      return res
        .status(401)
        .send({ message: "Email or Password is Not Valid" });
    }
    let token = jwt.sign({ id: user._id }, login_token);
    console.log(token);
    res.cookie('jwt_review', token, cookieOptions)
    res.status(200).json({
      status: "success"
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.Protect = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      let decoded = await util.promisify(jwt.verify)(token, login_token);
      let freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        res
          .status(401)
          .json({
            status: "Your Login Token has been Expired, Please Login again",
            message: err.message,
          });
      }
      req.user = freshUser;
      next();
      // Check whether user has changed password after token issued
    } else {
      res
        .status(403)
        .json({
          status: "failed",
          message: "You are not Logged In, Please Login First...",
        });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed!",
      message: err.message,
    });
  }
};

exports.RestrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({ status: "failed", message: "You are not Authorized" });
    }
    next();
  };
};
