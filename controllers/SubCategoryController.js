const mongoose = require("mongoose");
const SubCategory = require("../models/SubCategory"); 
const cloudinary = require("../utils/cloudinary");

module.exports = {
  /*** Add Sub Category to Database ***/
  add_sub_category: async (req, res) => {
    try {
      if(!req.file) {
        return res.status(400).send({ status: "fail", message: "Please upload image" });
      }

      const { title, location, type, email, phone, website, Category } = req.body;
      let image_upload = await cloudinary.uploader.upload(req.file.path);
      let contacts = [{email, phone, website}]
      let data = {
        title,
        location,
        type,
        contacts, 
        image: image_upload.secure_url,
        image_id: image_upload.public_id,
        Category: mongoose.Types.ObjectId(Category),
      } 
      const subcategory = await SubCategory.create(data);
      res.status(200).json({ 
        status: "success", 
        data: {
          subcategory
        } 
      });
    } catch (err) {
      res.status(500).send({ status: "fail", message: err.message });
    }
  },

  /*** Get Sub Categories from Database ***/
  get_sub_categories: async (req, res) => {
    try {
      // Filteration
      let queryObj = {...req.query};
      let excludedFields = ['page', 'limit', 'sort', 'fields'];
      excludedFields.forEach(field => delete queryObj[field]);
      
      // Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);
      console.log(JSON.parse(queryStr));


      let query = SubCategory.find(JSON.parse(queryStr)).populate({
        path: "Category",
        model: "Category",
        select: "title"
      }); 
      
      // Sorting
      if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
      } else {
        query = query.sort('-createdAt');
      }

      //Fields Limiting

      if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        query = query.select(fields);
      } else {
        query = query.select('-__v');
      }

      //Pagination
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 10;
      const skip = (page - 1) * limit;
      
      query = query.skip(skip).limit(limit);
      
      if(req.query.page) {
        const data = await SubCategory.countDocuments();
        if(skip >= data) throw new Error("This page does not exist");
      }
      // Execute the Query
      const subcategory = await query;

      // Send the Response
      res.status(200).json({ 
          status: "success",
          results:subcategory.length,
          data: {
            subcategory
          }
        });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  },


  /*** get an single sub category ***/
  edit_sub_category: async (req, res) => {
    try {
      let subcategory = await SubCategory.findById(req.params.id);
      res.status(200).json({ 
        status: "success", 
        data: {
          subcategory
        }
      });
    } catch (err) {
      res.status(500).json({ status: "fail", message: err.message });
    }
  },

  /*** Update a Sub Category ***/
  update_sub_category: async(req, res) => {
    try {
      let image_upload;
      if (req.file) {
        let record = await SubCategory.findById(req.params.id);
        console.log(record);
        await cloudinary.uploader.destroy(record.image_id);
        image_upload = await cloudinary.uploader.upload(req.file.path);
      }
      console.log(image_upload);
      let data = {
        ...req.body,
        image: image_upload && image_upload.secure_url,
        image_id: image_upload && image_upload.public_id,
      };
      console.log(req.body);
      const subcategory = await SubCategory.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true
      });
        res.status(200).json({
          status:'success', 
          data: {
            subcategory
          }
        });
    } catch (err) {
        res.status(401).json({status:"fail",message: err.message});
    }
  },
  /*** Remove Sub Category ***/
  remove_sub_category: async (req, res) => {
    try {
      let result = await SubCategory.findById(req.params.id);
      if(!result) {
        res.status(404).json({ status: "fail", message: "Sub Category not found" });
       return true;
      }
      await SubCategory.findByIdAndDelete(req.params.id);
      await cloudinary.uploader.destroy(result.image_id);
      res.status(200).json({
        status:'success', 
        data: null,
        message: "Sub Category deleted successfully"
      });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
