const Book = require('../models/bookModel');
const Student = require('../models/studentModel');
const BorrowRecord = require('../models/borrowRecordModel');
const bcrypt = require('bcryptjs');

// @desc    Add a new book
// @route   POST /api/admin/books
// @access  Private/Admin
const addNewBook = async (req, res) => {
    const { title, author, genre, description, totalCopies } = req.body;

    try {
        const book = new Book({
            title,
            author,
            genre,
            description,
            totalCopies,
            availableCopies: totalCopies,
        });

        const createdBook = await book.save();
        res.status(201).json(createdBook);
    } catch (error) {
        res.status(400).json({ message: 'Error adding book', error: error.message });
    }
};

// @desc    Get all borrow records
// @route   GET /api/admin/borrows
// @access  Private/Admin
const getAllBorrowRecords = async (req, res) => {
    try {
        const { studentId } = req.query;
        let filter = {};

        // If a studentId search term is provided
        if (studentId) {
            // Find the student's internal _id based on their public studentId
            const student = await Student.findOne({
                studentId: { $regex: studentId, $options: 'i' }
            });

            if (student) {
                // If student is found, filter borrow records by their internal _id
                filter.student = student._id;
            } else {
                // If no student matches the search, return an empty array
                return res.json([]);
            }
        }

        // Find records using the filter (empty filter {} fetches all)
        const records = await BorrowRecord.find(filter)
            .populate('student', 'name studentId')
            .populate('book', 'title')
            .sort({ dueDate: 1 });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a borrow record (return book or extend due date)
// @route   PUT /api/admin/borrows/:id
// @access  Private/Admin
const updateBorrowStatus = async (req, res) => {
    const { returned, dueDate } = req.body;
    try {
        const record = await BorrowRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        // Handle book return
        if (returned === true && !record.returned) {
            record.returned = true;
            record.returnDate = new Date();

            await Book.findByIdAndUpdate(record.book, { $inc: { availableCopies: 1 } });
        }

        // Handle due date extension
        if (dueDate) {
            if (new Date(dueDate) < new Date(record.borrowDate)) {
                return res.status(400).json({ message: 'Due date cannot be before the borrow date.' });
            }
            record.dueDate = dueDate;
        }

        const updatedRecord = await record.save();
        res.json(updatedRecord);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Search for a student by their ID and get their borrow history
// @route   GET /api/admin/students/search?studentId=...
// @access  Private/Admin
const searchStudentById = async (req, res) => {
    const { studentId } = req.query;
    try {
        const student = await Student.findOne({ studentId }).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const borrowHistory = await BorrowRecord.find({ student: student._id })
            .populate('book', 'title')
            .sort({ borrowDate: -1 });

        res.json({ student, borrowHistory });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Change a student's password
// @route   PUT /api/admin/students/change-password
// @access  Private/Admin
const changeStudentPassword = async (req, res) => {
    const { studentId, newPassword } = req.body;
    try {
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const student = await Student.findOne({ studentId: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.password = newPassword; // The pre-save hook will hash it
        await student.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Get all students with optional search by studentId
// @route   GET /api/admin/students
// @access  Private/Admin
const getAllStudents = async (req, res) => {
    try {
        const { studentId } = req.query;
        let query = {};

        if (studentId) {
            query.studentId = { $regex: studentId, $options: 'i' };
        }

        // Find students, exclude their password from the result
        const students = await Student.find(query).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Update a book's details
// @route   PUT /api/admin/books/:id
// @access  Private/Admin
const updateBookDetails = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const { title, author, genre, description, totalCopies } = req.body;

        // Smartly update availableCopies when totalCopies is changed
        if (totalCopies !== undefined && totalCopies !== book.totalCopies) {
            const difference = totalCopies - book.totalCopies;
            book.availableCopies = Math.max(0, book.availableCopies + difference); // Ensure it doesn't go below zero
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.genre = genre || book.genre;
        book.description = description || book.description;
        book.totalCopies = totalCopies || book.totalCopies;

        const updatedBook = await book.save();
        res.json(updatedBook);

    } catch (error) {
        console.error("Update Book Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    updateBookDetails,
    getAllStudents,
    addNewBook,
    getAllBorrowRecords,
    updateBorrowStatus,
    searchStudentById,
    changeStudentPassword
};