import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    const availabilityText = book.availability ? `${book.availableCopies} copies left` : 'Borrowed Out';
    const availabilityColor = book.availability ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 truncate">{book.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">by {book.author}</p>
                <p className="text-sm text-gray-500 mb-4">{book.genre}</p>
                <div className="flex justify-between items-center">
                    <span className={`font-semibold ${availabilityColor}`}>{availabilityText}</span>
                    <Link to={`/book/${book._id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BookCard;