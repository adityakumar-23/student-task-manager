const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require JWT authentication
router.use(protect);

// Dashboard statistics
router.get('/stats', getTaskStats);

// Task CRUD
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
