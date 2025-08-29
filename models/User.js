const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    default: '000000000'
  },
  city: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum :['male', 'female'],
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please enter an email']
  },
  password: {
    type: String,
    required: [true, 'Please enter an password']
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client',
    required: [true, 'Please enter an password']
  },
  photo: {
    type: String,
    default :"https://www.gravatar.com/avatar/?d=mp&f=y",
  }
  
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const User =  mongoose.model('User', userSchema)

module.exports = User;