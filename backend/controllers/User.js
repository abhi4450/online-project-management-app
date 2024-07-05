const rootDir = require("../util/path");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

function generateAccessToken(userId) {
  const jwtSecret = process.env.JWT_SECRET;
  return jwt.sign({ userId }, jwtSecret);
}

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("USER_EMAIL && PASSWORD :", email, password);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not Found!", success: false });
    }

    if (user.password !== password) {
      return res
        .status(401)
        .json({
          message: "Email is valid but incorrect password",
          success: false,
        });
    }

    const token = generateAccessToken(user._id);

    return res.status(200).json({
      message: "User Logged In Successfully.",
      success: true,
      token: token,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
