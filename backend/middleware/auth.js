const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  try {
    const token = req.header("Authorization");

    const decodedToken = jwt.verify(token, jwtSecret);

    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
   
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Invalid token", error: error.message });
  }
};

module.exports = {
  authenticate,
};
