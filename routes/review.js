const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReviews} = require("../middleware.js")

const {isLoggedIn,isAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");



// reviews
router.post("/",isLoggedIn,wrapAsync(reviewController.reviwePost));

// delete
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;