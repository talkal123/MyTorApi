const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  businessId: {
  type:String,
  },
  userId: {
  type:String,
  },
  businessName: {
  type:String,
  },
  businessPhoto: {
  type:String,
  },
  clientName: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

const Appointment =  mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment;