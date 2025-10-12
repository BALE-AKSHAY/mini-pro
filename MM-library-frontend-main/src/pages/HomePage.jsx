import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import BookCard from '../components/BookCard';

const HomePage = () => {
    const [genres, setGenres] = useState([]); // State for dynamic genres
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingGenres, setLoadingGenres] = useState(true);

    // Effect to fetch unique genres on component mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await api.get('/books/genres');
                setGenres(response.data.sort()); // Sort genres alphabetically
            } catch (error) {
                console.error('Error fetching genres:', error);
            } finally {
                setLoadingGenres(false);
            }
        };
        fetchGenres();
    }, []);

    // Effect for handling book search
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }

        const fetchBooks = async () => {
            try {
                const response = await api.get(`/books?search=${searchTerm}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error searching books:', error);
            }
        };

        const timerId = setTimeout(() => {
            fetchBooks();
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    return (
        <div>
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-2">Find Your Next Great Read</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">Search for a specific book or browse by genre below.</p>
                <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-4 w-full max-w-lg p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {searchTerm.trim() === '' ? (
                // GENRE GRID VIEW
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-center">Explore by Genre</h2>
                    {loadingGenres ? <p className="text-center">Loading genres...</p> : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {genres.map((genre) => (
                                <Link
                                    key={genre}
                                    to={`/genre/${genre}`}
                                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 text-center"
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{genre}</h3>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // SEARCH RESULTS VIEW
                <div>
                    <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {searchResults.length > 0 ? (
                            searchResults.map((book) => <BookCard key={book._id} book={book} />)
                        ) : (
                            <p className="col-span-full text-center">No books found matching your search.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;