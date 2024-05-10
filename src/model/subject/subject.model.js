const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
            trim: true
      },
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

module.exports.Subject = mongoose.model('Subject', subjectSchema);
