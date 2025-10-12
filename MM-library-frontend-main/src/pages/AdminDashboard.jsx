import React from 'react';
import { Link } from 'react-router-dom';
import AddBookForm from '../components/AddBookForm';
import ManageBorrows from '../components/ManageBorrows';

const AdminDashboard = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6 border-b pb-2 dark:border-gray-700">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="space-x-4">
                    <Link to="/admin/books" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                        Manage Books
                    </Link>
                    <Link to="/admin/students" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
                        Manage Students
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <AddBookForm />
                </div>
                <div className="md:col-span-2">
                    <ManageBorrows />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;