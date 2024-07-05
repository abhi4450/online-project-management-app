const express = require("express");

const router = express.Router();

const userAuth = require("../middleware/auth");
const userController = require("../controllers/User");

router.post("/login", userController.loginUser);

module.exports = router;
