const Subject = require('../models/Subject');
const Task = require('../models/Task');

// @desc    Get all subjects for the logged-in student
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      count: subjects.length,
      subjects
    });
  } catch (error) {
    console.error('Get Subjects Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching subjects'
    });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a subject name'
      });
    }

    const trimmedName = name.trim();

    // Check if subject already exists for this student
    const existing = await Subject.findOne({
      userId: req.user._id,
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Subject "${trimmedName}" already exists`
      });
    }

    const subject = await Subject.create({
      userId: req.user._id,
      name: trimmedName
    });

    return res.status(201).json({
      success: true,
      message: 'Subject added successfully',
      subject
    });
  } catch (error) {
    console.error('Create Subject Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating subject'
    });
  }
};

// @desc    Update a subject name
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid subject name'
      });
    }

    const trimmedName = name.trim();

    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    const oldName = subject.name;

    // Check duplicate
    const duplicate = await Subject.findOne({
      userId: req.user._id,
      _id: { $ne: req.params.id },
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `Another subject with name "${trimmedName}" already exists`
      });
    }

    subject.name = trimmedName;
    await subject.save();

    // Update tasks referencing the old subject name
    await Task.updateMany(
      { userId: req.user._id, subject: oldName },
      { subject: trimmedName }
    );

    return res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      subject
    });
  } catch (error) {
    console.error('Update Subject Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating subject'
    });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    await Subject.deleteOne({ _id: subject._id });

    return res.status(200).json({
      success: true,
      message: `Subject "${subject.name}" deleted successfully`
    });
  } catch (error) {
    console.error('Delete Subject Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting subject'
    });
  }
};

module.exports = {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
};
