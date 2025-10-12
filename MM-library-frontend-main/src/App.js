import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookDetailsPage from './pages/BookDetailsPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import GenrePage from './pages/GenrePage';
import ManageStudentsPage from './pages/ManageStudentsPage';
import ManageBooksPage from './pages/ManageBooksPage';
import { Toaster } from 'sonner';
function App() {
  return (
    <Router>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <Toaster richColors position="top-center" />
        <Navbar />
        <main className="container mx-auto p-4 md:p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            {/* This line defines the destination for the login link */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
            <Route path="/genre/:genreName" element={<GenrePage />} />

            {/* Private Student Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
            </Route>

            {/* Private Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<ManageStudentsPage />} />
              <Route path="/admin/books" element={<ManageBooksPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;