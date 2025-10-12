
const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returned: { type: Boolean, default: false },
    returnDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);