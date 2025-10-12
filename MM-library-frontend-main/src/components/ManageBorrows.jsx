import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FaSave, FaTimes } from 'react-icons/fa';

// Helper function to format date for the date input field (YYYY-MM-DD)
const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
};

const ManageBorrows = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // State to manage which row is being edited
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [newDueDate, setNewDueDate] = useState('');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await api.get(`/admin/borrows?studentId=${searchTerm}`);
                setRecords(response.data);
            } catch (error) {
                console.error('Error fetching borrow records:', error);
            } finally {
                setLoading(false);
            }
        };

        const timerId = setTimeout(() => {
            setLoading(true);
            fetchRecords();
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const refreshRecords = async () => {
        const response = await api.get(`/admin/borrows?studentId=${searchTerm}`);
        setRecords(response.data);
    }

    const handleReturn = async (recordId) => {
        try {
            await api.put(`/admin/borrows/${recordId}`, { returned: true });
            refreshRecords(); // Refresh the list
        } catch (error) {
            console.error('Error marking book as returned:', error);
        }
    };

    // --- Functions for Extending Date ---

    // When admin clicks "Extend", this sets the state to activate edit mode
    const handleExtendClick = (record) => {
        setEditingRecordId(record._id);
        setNewDueDate(formatDateForInput(record.dueDate));
    };

    const handleCancelEdit = () => {
        setEditingRecordId(null);
        setNewDueDate('');
    };

    const handleSaveDate = async (recordId) => {
        try {
            await api.put(`/admin/borrows/${recordId}`, { dueDate: newDueDate });
            setEditingRecordId(null); // Exit edit mode
            refreshRecords(); // Refresh the list
        } catch (error) {
            console.error('Error extending due date:', error);
            alert('Failed to extend due date.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Manage Borrow Records</h3>
                <input
                    type="text"
                    placeholder="🔍 Search by Student ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/3 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="overflow-x-auto">
                {loading ? <p>Loading...</p> : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="p-3">Book Title</th>
                                <th className="p-3">Student ID</th>
                                <th className="p-3">Due Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length > 0 ? records.map(record => (
                                <tr key={record._id} className="border-b dark:border-gray-700">
                                    <td className="p-3">{record.book?.title || 'N/A'}</td>
                                    <td className="p-3">{record.student?.studentId || 'N/A'}</td>
                                    <td className="p-3">
                                        {/* THIS IS THE CORE LOGIC THAT WAS LIKELY BROKEN */}
                                        {editingRecordId === record._id ? (
                                            <input
                                                type="date"
                                                value={newDueDate}
                                                onChange={(e) => setNewDueDate(e.target.value)}
                                                className="p-1 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                        ) : (
                                            new Date(record.dueDate).toLocaleDateString()
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {record.returned ? <span className="text-green-500">Returned</span> : <span className="text-yellow-500">Borrowed</span>}
                                    </td>
                                    <td className="p-3">
                                        {!record.returned && (
                                            <div className="flex items-center justify-center space-x-2">
                                                {editingRecordId === record._id ? (
                                                    <>
                                                        <button onClick={() => handleSaveDate(record._id)} className="text-green-500 hover:text-green-700"><FaSave /></button>
                                                        <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-700"><FaTimes /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleReturn(record._id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm rounded">Return</button>
                                                        <button onClick={() => handleExtendClick(record)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded">Extend</button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-4">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageBorrows;