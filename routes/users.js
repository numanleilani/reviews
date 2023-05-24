const express = require("express");
const router = express.Router();
//-- *********** Import Controller Functions *********** --//
const AuthController = require("../controllers/AuthController");
//-- ********************* Routes ********************* --//

router.post("/signup", AuthController.Signup);
router.post("/login", AuthController.Login);

module.exports = router;
