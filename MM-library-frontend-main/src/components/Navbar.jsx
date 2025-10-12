import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import useAuth from '../hooks/useAuth';
import { FaSun, FaMoon, FaBook } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                    <FaBook className="mr-2" /> Library
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/admin" className="hover:text-blue-500">Admin Panel</Link>
                            ) : (
                                <Link to="/dashboard" className="hover:text-blue-500">My Dashboard</Link>
                            )}
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {/* This link MUST point to "/login" */}
                            <Link to="/login" className="hover:text-blue-500">Login</Link>
                            <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                                Sign Up
                            </Link>
                        </>
                    )}
                    <button onClick={toggleTheme} className="text-xl">
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;