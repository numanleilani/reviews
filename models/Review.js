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
  subcategory: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
    required: [true, "Sub Category is Required"],
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
const Reviews = mongoose.model("Reviews", ReviewSchema);
module.exports = Reviews;
