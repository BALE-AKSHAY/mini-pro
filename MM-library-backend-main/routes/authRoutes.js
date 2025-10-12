const express = require('express');
const router = express.Router();
const { registerStudent, loginUser, getStudentProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerStudent);
router.post('/login', loginUser);
router.get('/me', protect, getStudentProfile); // To get current logged-in user info

module.exports = router;