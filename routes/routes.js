const express = require("express");
const router = express.Router(); 
const upload = require("../middleware/MulterMiddleware");  
//-- *********** Import Controller Functions *********** --// 
const CategoryController = require("../controllers/CategoryController");
const SubCategoryController = require("../controllers/SubCategoryController");  
const ReviewsController = require('../controllers/ReviewsController');
const ProtectRoute = require("../controllers/AuthController.js")
//-- ********************* Routes ********************* --// 

router.get("/", (req,res) =>{
  res.send("Reviews Api")
})

  //! *** Category Routes ***!//
  router.route("/category")
  .get(ProtectRoute.Protect, ProtectRoute.RestrictTo('admin'), CategoryController.get_categories) /*** Get all Category ***/
  .post(upload.single('image'), CategoryController.add_category) /*** Add New Category ***/
router.route("/category/:id")
  .get(CategoryController.edit_category) /*** Get a Single Category ***/
  .patch(upload.single('image'),CategoryController.update_category) /*** Update Category ***/
  .delete(CategoryController.remove_category) /*** Remove Category ***/
  
  
  //! *** Sub Category Routes ***!//
  router.route("/sub-category")
  .get(SubCategoryController.get_sub_categories) /*** Get all Sub Category ***/
  .post(upload.single('image'), SubCategoryController.add_sub_category) /*** Add New Sub Category ***/
router.route("/sub-category/:id")
  .get(SubCategoryController.edit_sub_category) /*** Get a Single Sub Category ***/
  .patch(upload.single('image'),SubCategoryController.update_sub_category) /*** Update Sub Category ***/
  .delete(SubCategoryController.remove_sub_category) /*** Remove Sub Category ***/
  
  
  //! *** Review Routes ***!//
  router.route("/review")
  .get(ReviewsController.get_reviews) /*** Get all Reviews ***/
  .post( ReviewsController.add_review) /*** Add New Reviews ***/
router.route("/review/:id")
  .get(ReviewsController.edit_review) /*** Get a Single Review ***/
  .patch(ReviewsController.update_review) /*** Update Reviews ***/
  .delete(ReviewsController.remove_review) /*** Remove Reviews ***/
  
  module.exports = router;


 