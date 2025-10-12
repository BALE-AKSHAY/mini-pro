import React, { useState, useEffect } from 'react';
import api from '../api/api';

const StudentDashboard = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [borrowsRes, userRes] = await Promise.all([
                    api.get('/books/myborrows/all'),
                    api.get('/auth/me')
                ]);
                setBorrowedBooks(borrowsRes.data);
                setUserInfo(userRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            {userInfo && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">My Profile</h2>
                    <p><strong>Name:</strong> {userInfo.name}</p>
                    <p><strong>Student ID:</strong> {userInfo.studentId}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">My Borrowed Books</h2>
                {borrowedBooks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="p-3">Book Title</th>
                                    <th className="p-3">Borrow Date</th>
                                    <th className="p-3">Due Date</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowedBooks.map(record => (
                                    <tr key={record._id} className="border-b dark:border-gray-700">
                                        <td className="p-3">{record.book.title}</td>
                                        <td className="p-3">{new Date(record.borrowDate).toLocaleDateString()}</td>
                                        <td className="p-3">{new Date(record.dueDate).toLocaleDateString()}</td>
                                        <td className="p-3">{record.returned ? <span className="text-green-500">Returned</span> : <span className="text-yellow-500">Borrowed</span>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>You have not borrowed any books.</p>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;