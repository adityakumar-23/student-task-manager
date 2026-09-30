const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Please provide a subject name'],
      trim: true,
      maxlength: [100, 'Subject name cannot exceed 100 characters']
    }
  },
  {
    timestamps: true
  }
);

// Compound index so a user cannot create duplicate subject names
subjectSchema.index({ userId: 1, name: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
