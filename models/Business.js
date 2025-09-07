const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  description: {
    type: String,
  },
  businessOwner: {
    type: String,
    default: "John Doe"
  },
  businessOwnerPhoto: {
    type: String,
    default: "https://www.gravatar.com/avatar/?d=mp&f=y",
  },
  businessType: {
    type: String,
    enum: ['barber', 'restaurant', 'salon', 'clothes', 'gym'],
    required: true,
  },
  services: [
    {
      name: String,
      serviceTime: Number,
      price: Number,
      image: String,
    },
  ],
  rating: [
    {
      userId: { type: String, required: true },
      value: { type: Number, required: true },
      userName: { type: String, required: true } 
    }
  
],
  images: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
