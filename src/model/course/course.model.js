const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
            trim: true
      },
      price: {
            type: Number,
            required: true
      },
      images: [{
            type: String,
            required: false
      }],
      isAvailable: {
            type: Boolean,
            default: false
      },
      createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // it is model name
      },
      createdAt: {
            type: Date,
            default: new Date()
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

module.exports.Course = mongoose.model('Course', courseSchema);
