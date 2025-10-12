const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAllStudents,
    updateBookDetails,
    addNewBook,
    getAllBorrowRecords,
    updateBorrowStatus,
    searchStudentById,
    changeStudentPassword
} = require('../controllers/adminController');

// All routes in this file are protected and require admin access
router.use(protect);

router.put('/books/:id', updateBookDetails);
router.get('/students', getAllStudents);
router.post('/books', addNewBook);
router.get('/borrows', getAllBorrowRecords);
router.put('/borrows/:id', updateBorrowStatus); // For extending or returning
router.get('/students/search', searchStudentById);
router.put('/students/change-password', changeStudentPassword);

module.exports = router;