const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    subject: {
      type: String,
      required: [true, 'Please assign a subject to the task'],
      trim: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide a deadline date']
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast querying & sorting
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, deadline: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
