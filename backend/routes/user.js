const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {getUserDetails} = require("../controllers/userController");

router.get("/me", authenticate, getUserDetails);

module.exports = router;