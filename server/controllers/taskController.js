const Task = require('../models/Task');
const Subject = require('../models/Subject');

// @desc    Get all tasks for current student with filters, search, and sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, subject, sortBy } = req.query;

    const query = { userId: req.user._id };

    // Search filter across title and description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Subject filter
    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    // Sorting logic
    let sortOptions = { deadline: 1 }; // Default: closest deadline first
    if (sortBy === 'deadline_desc') {
      sortOptions = { deadline: -1 };
    } else if (sortBy === 'createdAt_desc') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'createdAt_asc') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'priority_desc') {
      // Custom priority sort can be handled or default
      sortOptions = { priority: -1, deadline: 1 };
    }

    const tasks = await Task.find(query).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
};

// @desc    Get dashboard metrics & summary
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalTasks, pendingTasks, inProgressTasks, completedTasks, highPriorityTasks] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'Pending' }),
      Task.countDocuments({ userId, status: 'In Progress' }),
      Task.countDocuments({ userId, status: 'Completed' }),
      Task.countDocuments({ userId, priority: 'High', status: { $ne: 'Completed' } })
    ]);

    // Retrieve next 5 upcoming assignments ordered by deadline that aren't completed
    const upcomingTasks = await Task.find({
      userId,
      status: { $ne: 'Completed' }
    })
      .sort({ deadline: 1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      stats: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        highPriority: highPriorityTasks
      },
      upcomingTasks
    });
  } catch (error) {
    console.error('Task Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while generating dashboard statistics'
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    return res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get Task By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching task details'
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, subject, priority, status, deadline } = req.body;

    if (!title || !subject || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide task title, subject, and deadline'
      });
    }

    const trimmedSubject = subject.trim();

    // Auto-create subject for user if not yet registered
    const existingSubject = await Subject.findOne({
      userId: req.user._id,
      name: { $regex: new RegExp(`^${trimmedSubject}$`, 'i') }
    });

    if (!existingSubject) {
      await Subject.create({
        userId: req.user._id,
        name: trimmedSubject
      });
    }

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      subject: trimmedSubject,
      priority: priority || 'Medium',
      status: status || 'Pending',
      deadline: new Date(deadline)
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating task'
    });
  }
};

// @desc    Update task details or change status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const { title, description, subject, priority, status, deadline } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (deadline !== undefined) task.deadline = new Date(deadline);

    if (subject !== undefined) {
      const trimmedSubject = subject.trim();
      task.subject = trimmedSubject;

      // Ensure subject is in user's subjects list
      const existingSubject = await Subject.findOne({
        userId: req.user._id,
        name: { $regex: new RegExp(`^${trimmedSubject}$`, 'i') }
      });
      if (!existingSubject) {
        await Subject.create({
          userId: req.user._id,
          name: trimmedSubject
        });
      }
    }

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update Task Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating task'
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.deleteOne({ _id: task._id });

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete Task Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
