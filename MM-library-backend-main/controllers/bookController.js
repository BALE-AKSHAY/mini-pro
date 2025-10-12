const Book = require('../models/bookModel');
const BorrowRecord = require('../models/borrowRecordModel');
const crypto = require('crypto');

// @desc    Get all books with search and genre filtering
// @route   GET /api/books
// @access  Public
const getAllBooks = async (req, res) => {
    try {
        const { search, genre } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ];
        }

        if (genre) {
            query.genre = genre;
        }

        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Borrow a book
// @route   POST /api/books/borrow/:id
// @access  Private (Student)
const borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.availableCopies < 1) {
            return res.status(400).json({ message: 'No copies available to borrow' });
        }

        // Decrease available copies
        book.availableCopies -= 1;
        await book.save();

        // Create a borrow record
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // Set due date to 14 days from now

        const borrowRecord = await BorrowRecord.create({
            token: crypto.randomBytes(16).toString('hex'),
            student: req.user.id,
            book: book.id,
            dueDate: dueDate,
        });

        res.status(201).json({
            message: 'Book borrowed successfully',
            borrowRecord
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all books borrowed by the logged-in student
// @route   GET /api/books/myborrows/all
// @access  Private
const getStudentBorrows = async (req, res) => {
    try {
        const records = await BorrowRecord.find({ student: req.user.id })
            .populate('book', 'title author genre')
            .sort({ borrowDate: -1 });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
const getUniqueGenres = async (req, res) => {
    try {
        // Use Mongoose's distinct() method to get a unique array of genres
        const genres = await Book.distinct('genre');
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getUniqueGenres, getAllBooks, getBookById, borrowBook, getStudentBorrows };