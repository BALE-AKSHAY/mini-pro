const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/studentModel');
const { validationResult } = require('express-validator');

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res) => {
    const { name, studentId, email, password } = req.body;

    if (!name || !studentId || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const studentExists = await Student.findOne({ $or: [{ email }, { studentId }] });
        if (studentExists) {
            return res.status(400).json({ message: 'Student ID or Email already exists' });
        }

        const student = await Student.create({ name, studentId, email, password });

        if (student) {
            res.status(201).json({
                _id: student.id,
                name: student.name,
                email: student.email,
                studentId: student.studentId,
                role: student.role,
                token: generateToken(student._id, student.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid student data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Authenticate a user (student or admin)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
        return res.status(400).json({ message: 'Please provide Student ID and password' });
    }

    try {
        const user = await Student.findOne({ studentId });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                studentId: user.studentId,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getStudentProfile = async (req, res) => {
    res.status(200).json(req.user);
};


// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = { registerStudent, loginUser, getStudentProfile };