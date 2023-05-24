const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim:true,
    required: [true, "Name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique:true,
    trim:true,
    lowercase:true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required:[true,"Password is Required!"],
    minLength:[8, "Password must have at least 8 characters long!"],
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'lead', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12)
  next();
})
const User = mongoose.model("User", UserSchema);
module.exports = User;
