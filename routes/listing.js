const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateListings} = require("../middleware.js")
const {isLoggedIn,isOwner} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer  = require('multer')
const {storage}= require("../cloudeConfig.js");

const upload = multer({storage});


router.route("/")
 .get(wrapAsync(listingController.index))
 .post(isLoggedIn,upload.single('image'),wrapAsync(listingController.createNewpost)
 );
// create new
router.get("/new",isLoggedIn,listingController.createNewget);

// show in details
router.route("/:id")
 .get(wrapAsync(listingController.showRoute))
 .patch(isLoggedIn,isOwner,upload.single('image'),wrapAsync(listingController.updatepatch))
 .delete(isLoggedIn,isOwner,wrapAsync(listingController.delete)
);

// update
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.updateget));

module.exports = router;