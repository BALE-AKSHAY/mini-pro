import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', studentId: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
                <div className="mb-4">
                    <label className="block mb-1">Name</label>
                    <input type="text" name="name" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Student ID</label>
                    <input type="text" name="studentId" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input type="email" name="email" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <div className="mb-6">
                    <label className="block mb-1">Password</label>
                    <input type="password" name="password" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded disabled:bg-blue-300">
                    {loading ? 'Registering...' : 'Register'}
                </button>


                <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;