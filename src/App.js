import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import DoctorRegistrationForm from './pages/DoctorRegistrationForm';
import ProtectedRoute from './components/ProtectedRoute';
import DoctorSearch from './pages/DoctorSearch'; // DoctorSearch bileşenini import ediyoruz
import AppointmentBooking from './pages/AppointmentBooking';
import DoctorReview from './pages/DoctorReview';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminPanel />
                    </ProtectedRoute>
                }
            />
            <Route path="/register" element={<DoctorRegistrationForm />} />
            <Route path="/search" element={<DoctorSearch />} /> {/* /search rotasını ekledik */}
            <Route path="/appointment/:id" element={<AppointmentBooking />} />
            <Route path="/review/:id" element={<DoctorReview />} />
        </Routes>
    );
};

export default App;
