import React, { useState } from 'react';
import api from '../api/api';

const AddBookForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        totalCopies: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const bookData = { ...formData, availableCopies: formData.totalCopies };
            await api.post('/admin/books', bookData);
            setMessage('Book added successfully!');
            // Clear the form
            setFormData({ title: '', author: '', genre: '', description: '', totalCopies: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add book.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Add New Book</h3>
            {message && <p className="bg-green-100 text-green-800 p-3 rounded mb-4">{message}</p>}
            {error && <p className="bg-red-100 text-red-800 p-3 rounded mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} placeholder="Total Copies" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required min="1" />
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">Add Book</button>
            </form>
        </div>
    );
};

export default AddBookForm;