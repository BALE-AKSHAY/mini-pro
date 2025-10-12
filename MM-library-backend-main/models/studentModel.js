const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please add a name'] },
    studentId: { type: String, required: [true, 'Please add a student ID'], unique: true },
    email: { type: String, required: [true, 'Please add an email'], unique: true },
    password: { type: String, required: [true, 'Please add a password'] },
    role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

// Hash password before saving the document
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Student', studentSchema);