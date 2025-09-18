const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { forwardAuthenticated } = require("../middleware/auth");

router.get("/register", forwardAuthenticated, authController.registerGet);
router.post("/register", authController.registerPost);

router.get("/login", forwardAuthenticated, authController.loginGet);
router.post("/login", authController.loginPost);

router.get("/logout", authController.logout);

router.get("/forgot", forwardAuthenticated, authController.forgotGet);

module.exports = router;
