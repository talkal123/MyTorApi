const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  businessId: {
  type:String,
  },
  clientName: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
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