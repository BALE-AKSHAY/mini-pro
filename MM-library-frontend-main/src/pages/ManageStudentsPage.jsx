import React, { useState, useEffect } from 'react';
import api from '../api/api';

const ManageStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // State for the password change modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/admin/students?studentId=${searchTerm}`);
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        };

        const timerId = setTimeout(() => fetchStudents(), 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const openPasswordModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        setNewPassword('');
        setMessage('');
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!newPassword) return;
        try {
            await api.put('/admin/students/change-password', {
                studentId: selectedStudent.studentId,
                newPassword: newPassword,
            });
            setMessage('Password updated successfully!');
            setTimeout(() => {
                setIsModalOpen(false);
            }, 2000);
        } catch (error) {
            setMessage('Failed to update password.');
            console.error('Password change error:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Students</h2>
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
                                <th className="p-3">Name</th>
                                <th className="p-3">Student ID</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id} className="border-b dark:border-gray-700">
                                    <td className="p-3">{student.name}</td>
                                    <td className="p-3">{student.studentId}</td>
                                    <td className="p-3">{student.email}</td>
                                    <td className="p-3">
                                        <button onClick={() => openPasswordModal(student)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm rounded">
                                            Change Password
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Password Change Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Change Password for {selectedStudent.name}</h3>
                        <form onSubmit={handlePasswordChange}>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                            {message && <p className="mt-4 text-center text-green-500">{message}</p>}
                            <div className="mt-6 flex justify-end space-x-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStudentsPage;