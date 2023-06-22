const Reviews = require("../models/Review"); 
const mongoose = require("mongoose");
const ApiFeatures = require("../utils/ApiFeatures")
module.exports = {
  /*** Add Review to Database ***/
  add_review: async (req, res) => {
    try { 
      if(!req.body.subcategory) {
        return res.status(400).json({status:'fail', message:'Please provide subcategory'});
      }
      const { title, details, rating } = req.body;
      let data = {
          title,
          details,
          rating, 
          user: mongoose.Types.ObjectId(req.body.user), 
        } 

      const review = await Reviews.create(data);
      res.status(200).json({
        status:'success', 
        data:{
          review
        }
      });
    }  
    catch (err) {
        res.status(401).json({status:'fail', message:err.message});
    }
  },

  /*** Get Reviews from Database ***/
  get_reviews: async (req, res) => {
    try {

      let features = new ApiFeatures(Reviews.find()
      
      .populate({
        path: 'user',
        model: 'User',
      })
      , req.query).filter().Paginate().sort().LimitFields();
      // Execute the Query
      const reviews = await features.query;
        res.status(200).json({
          status:'success',
          results: reviews.length,
          data: {
            reviews
          }
        });
    } catch (err) { 
        res.status(401).json({status: 'fail', message: err.message});
    }
  },

  /*** Get an existing Review ***/
  edit_review: async (req, res) => {
    try {
      let review =  await Reviews.findById(req.params.id)
      res.status(200).json({
        status:'success', 
        data: {
          review
        }
      })
    } catch (err) {
      res.status(401).json({status:'fail', message: err.message})
    }
      
  },

  update_review: async(req, res) => {
    try {
      const {title, user,   details, rating} = req.body;
      let data = {
        title,
        user: new mongoose.Types.ObjectId(user), 
        details,
        rating
        }
      const review = await Reviews.findByIdAndUpdate(req.params.id, data, {
        new: true,
        // runValidators: true
      });
        res.status(200).json({
          status:'success', 
          data:{
            review
          }
        });
    } catch (err) {
        res.json({status:'fail', message: err.message});
    }
  },

  remove_review : async (req, res) => {
    try {
      let review = await Reviews.findById(req.params.id);
      if(!review) {
        return res.status(404).json({status:'fail', message: 'Review not found'});
      }
      await Reviews.findByIdAndDelete(req.params.id);
       res.status(204).json({status:'success', data:null, message:'Review deleted successfully'});
    } catch (err) {
      res.status(404).json({status:'fail', message: err.message})
    }
  }
}
  /*** Remove a Review from Database ***/
  
