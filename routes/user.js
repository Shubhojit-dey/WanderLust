const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
 .get(userController.signupGet)
 .post(wrapAsync(userController.signupPost)
);

// login
router.route("/login")
 .get(userController.loginGet)
 .post(
    saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    wrapAsync(userController.loginPost
));

// loggedOut
router.get("/logout",userController.logoutGet);
module.exports = router;