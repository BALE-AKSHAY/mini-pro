const express = require('express');
const router = express.Router();
const { getUniqueGenres, getAllBooks, getBookById, borrowBook, getStudentBorrows } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
router.get('/genres', getUniqueGenres);
router.get('/', getAllBooks); // Public route to see/search books
router.get('/:id', getBookById); // Public route to see a single book
router.post('/borrow/:id', protect, borrowBook); // Private route for students to borrow
router.get('/myborrows/all', protect, getStudentBorrows); // Private route to see borrowed books

module.exports = router;