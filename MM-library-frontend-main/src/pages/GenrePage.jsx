import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import BookCard from '../components/BookCard';
import { FaArrowLeft } from 'react-icons/fa';

const GenrePage = () => {
    const { genreName } = useParams(); // Gets 'Mechanical', 'Fiction', etc. from the URL
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooksByGenre = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/books?genre=${genreName}`);
                setBooks(response.data);
            } catch (error) {
                console.error(`Error fetching books for genre ${genreName}:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksByGenre();
    }, [genreName]);

    if (loading) return <p className="text-center mt-8">Loading books...</p>;

    return (
        <div>
            <Link to="/" className="inline-flex items-center mb-6 text-blue-500 hover:underline">
                <FaArrowLeft className="mr-2" />
                Back to Genres
            </Link>
            <h1 className="text-3xl font-bold mb-6 border-b pb-2 dark:border-gray-700">
                Genre: <span className="text-blue-600 dark:text-blue-400">{genreName}</span>
            </h1>

            {books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            ) : (
                <p className="text-center mt-8">No books found in this genre.</p>
            )}
        </div>
    );
};

export default GenrePage;