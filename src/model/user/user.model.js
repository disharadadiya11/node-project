const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      name: {
            type: String,
            trim: true
      },
      email: {
            type: String,
            required: true,
            trim: true
      },
      password: {
            type: String,
            required: true,
            trim: true,
            select: false
      },
      image: {
            type: String,
            required: false
      },
      otp: {
            type: String,
            required: true,
            trim: true,
            select: false
      },
      isEmailVerify: {
            type: Boolean,
            default: false
      },
      isDelete: {
            type: Boolean,
            default: false
      },
      role: {
            type: String,
            required: true,
            trim: true,
            enum: ['admin', 'student', 'staff'],
            default: 'admin'
      },
      uuid: {
            type: String,
            required: true,
      },
      createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
      },
      createdAt: {
            type: Date,
      },
      updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
      },
      updatedAt: {
            type: Date,
      }
},
      { versionKey: false }
);

module.exports.User = mongoose.model('User', userSchema);