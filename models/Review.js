const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is Required!"],
  },
  details: {
    type: String,
    required: [true, "Review Must have Details!"],
  },
  rating: {
    type: String,
    enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    required: [true, "Rating is Required!"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is Required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
const Reviews = mongoose.model("Reviews", ReviewSchema);
module.exports = Reviews;
