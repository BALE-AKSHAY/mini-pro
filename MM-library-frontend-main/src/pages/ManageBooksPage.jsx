import React, { useState, useEffect } from 'react';
import api from '../api/api';

const ManageBooksPage = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/books?search=${searchTerm}`);
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };

        const timerId = setTimeout(() => fetchBooks(), 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const openEditModal = (book) => {
        setSelectedBook(book);
        setEditFormData({ ...book });
        setIsModalOpen(true);
        setMessage('');
    };

    const handleFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/books/${selectedBook._id}`, editFormData);
            setMessage('Book updated successfully!');
            const response = await api.get(`/books?search=${searchTerm}`);
            setBooks(response.data);
            setTimeout(() => {
                setIsModalOpen(false);
            }, 1500);
        } catch (error) {
            setMessage('Failed to update book.');
            console.error('Book update error:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Books</h2>
                <input
                    type="text"
                    placeholder="🔍 Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/3 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="overflow-x-auto">
                {loading ? <p>Loading...</p> : (
                    <table className="w-full text-left">
                        {/* Table Head */}
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="p-3">Title</th>
                                <th className="p-3">Author</th>
                                <th className="p-3">Genre</th>
                                <th className="p-3">Copies (Avail/Total)</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody>
                            {books.map(book => (
                                <tr key={book._id} className="border-b dark:border-gray-700">
                                    <td className="p-3 font-medium">{book.title}</td>
                                    <td className="p-3">{book.author}</td>
                                    <td className="p-3">{book.genre}</td>
                                    <td className="p-3">{book.availableCopies} / {book.totalCopies}</td>
                                    <td className="p-3">
                                        <button onClick={() => openEditModal(book)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Book Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Edit Book: {selectedBook.title}</h3>
                        <form onSubmit={handleUpdateBook} className="space-y-4">
                            {/* ✅ ADDED DARK THEME CLASSES TO ALL INPUTS */}
                            <input type="text" name="title" value={editFormData.title} onChange={handleFormChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                            <input type="text" name="author" value={editFormData.author} onChange={handleFormChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                            <input type="text" name="genre" value={editFormData.genre} onChange={handleFormChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                            <textarea name="description" value={editFormData.description} onChange={handleFormChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" rows="3" />
                            <input type="number" name="totalCopies" value={editFormData.totalCopies} onChange={handleFormChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                            {message && <p className="text-center text-green-500">{message}</p>}
                            <div className="mt-6 flex justify-end space-x-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBooksPage;