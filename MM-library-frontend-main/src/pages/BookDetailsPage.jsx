import React, { useState, useEffect } from 'react';
// Make sure 'useLocation' is imported from react-router-dom
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/api';
import useAuth from '../hooks/useAuth';
import { FaArrowLeft } from 'react-icons/fa';

const BookDetailsPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Call the hook to get the location object

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await api.get(`/books/${id}`);
                setBook(response.data);
            } catch (error) {
                console.error('Error fetching book details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleBorrow = async () => {
        if (!user) {
            navigate('/login', { state: { from: location } });
            return;
        }

        try {
            const response = await api.post(`/books/borrow/${id}`);
            setMessage(`Book borrowed successfully! Your token: ${response.data.borrowRecord.token}`);
            const updatedBook = await api.get(`/books/${id}`);
            setBook(updatedBook.data);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to borrow book.');
        }
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (!book) return <p className="text-center">Book not found.</p>;

    return (
        <div>
            <Link to="/" className="inline-flex items-center mb-6 text-blue-500 hover:underline">
                <FaArrowLeft className="mr-2" />
                Back to Home
            </Link>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">by {book.author}</p>
                <p className="text-lg mb-6">{book.description}</p>

                <div className="flex items-center space-x-4 mb-6">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                        {book.genre}
                    </span>
                    <span className={`font-semibold ${book.availability ? 'text-green-500' : 'text-red-500'}`}>
                        {book.availability ? `${book.availableCopies} copies available` : 'Currently unavailable'}
                    </span>
                </div>

                {message && <p className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md my-4">{message}</p>}

                {user?.role !== 'admin' && (
                    <button
                        onClick={handleBorrow}
                        disabled={!book.availability}
                        className="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Borrow Book
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookDetailsPage;