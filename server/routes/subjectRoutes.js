const express = require('express');
const router = express.Router();
const {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

// All subject routes require JWT authentication
router.use(protect);

router.route('/')
  .get(getSubjects)
  .post(createSubject);

router.route('/:id')
  .put(updateSubject)
  .delete(deleteSubject);

module.exports = router;
