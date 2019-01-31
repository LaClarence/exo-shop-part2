const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();

const Review = require("../models/review");
const Product = require("../models/product");

router.post("/review/create", async (req, res) => {
  try {
    const review = new Review({
      product: req.body.product,
      rating: req.body.rating,
      comment: req.body.comment,
      username: req.body.username
    });

    await review.save();

    const product = await Product.findById(req.body.product);
    if (product) {
      if (product.reviews === undefined) {
        product.reviews = [];
        product.averageRating = req.body.rating;
      } else {
        const nbReview = product.reviews.length;
        console.log("Number of reviews on this product is: ", nbReview);

        if (nbReview === 0) {
          product.averageRating = req.body.rating;
        } else {
          product.averageRating =
            (product.averageRating * nbReview + req.body.rating) /
            (nbReview + 1);
        }
        product.reviews.push(review);
      }
      console.log("Average of the product is now: ", product.averageRating);
      await product.save();
    } else {
      console.log("No product not found for this review");
    }
    res.json(review);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

/*

things.find({tennants: mongoose.Types.ObjectId("123")});

            console.log(
              `Avg: ${
                product.averageRating
              } Reviews:${nbReviews} Stars:${rating} NewStars:${
                req.body.rating
              }`
            );


*/
router.post("/review/update", async (req, res) => {
  try {
    const review = await Review.findById(req.query.id);
    if (review) {
      review.comment = req.body.comment;
      if (review.rating !== req.body.rating) {
        const rating = review.rating;
        review.rating = req.body.rating;
        const product = await Product.findOne({
          reviews: mongoose.Types.ObjectId(req.query.id)
        });
        if (product) {
          // console.log("Product found: ", product);
          if (product.reviews && product.reviews.length !== 0) {
            const nbReviews = product.reviews.length;
            product.averageRating =
              (product.averageRating * nbReviews - rating + req.body.rating) /
              nbReviews;
          }
          await product.save();
          console.log(
            "Average rating of product updated to",
            product.averageRating
          );
        } else {
          console.log("No product found with this review");
        }
      }
      await review.save();
      return res.json(review);
    } else {
      return res
        .status(400)
        .json({ message: "No review found with the given id." });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

router.post("/review/delete", async (req, res) => {
  try {
    const review = await Review.findById(req.query.id);
    if (!review) {
      return res
        .status(400)
        .json({ message: "No review found with the given id." });
    }
    const product = await Product.findOne({ reviews: { $in: [req.query.id] } });
    if (product) {
      const nbReviews = product.reviews.length;
      if (nbReviews === 1) {
        product.averageRating = 0;
      } else {
        product.averageRating =
          (product.averageRating * nbReviews - review.rating) / (nbReviews - 1);
      }
      product.reviews.remove(req.query.id);
      await product.save();
    } else {
      console.log("No product found with this review");
    }
    await review.remove();
    return res.json({ message: "Review removed" });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;
