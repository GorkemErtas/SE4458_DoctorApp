import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import edildi
import '../styles/DoctorRegistrationForm.css';
import { jwtDecode } from 'jwt-decode';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "";


const countryCityMap = {
    Turkey: ['Istanbul', 'Ankara', 'Izmir'],
    USA: ['New York', 'Los Angeles', 'Chicago'],
    UK: ['London', 'Manchester', 'Birmingham'],
    Germany: ['Berlin', 'Munich', 'Hamburg'],
};

const DoctorRegistrationForm = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        fullname: '',
        areaOfInterest: '',
        availableDays: [],
        startTime: '',
        endTime: '',
        address: '',
        city: '',
        country: '',
    });

    const navigate = useNavigate(); // Yönlendirme fonksiyonu

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'country') {
            setFormData({ ...formData, [name]: value, city: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCheckboxChange = (day) => {
        const updatedDays = formData.availableDays.includes(day)
            ? formData.availableDays.filter((d) => d !== day)
            : [...formData.availableDays, day];
        setFormData({ ...formData, availableDays: updatedDays });
    };

    const handleGoogleSuccess = (response) => {
        const decodedToken = jwtDecode(response.credential);
        setIsAuthenticated(true);
        setFormData({ ...formData, email: decodedToken.email, fullname: decodedToken.name });
        alert(`Google Authentication Successful! Welcome ${decodedToken.name}`);
    };

    const handleGoogleFailure = () => {
        alert('Google Authentication Failed. Please try again.');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            alert('Please authenticate with Google first.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/doctors/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message); // Başarı mesajını göster
                setFormData({
                    email: '',
                    fullname: '',
                    areaOfInterest: '',
                    availableDays: [],
                    startTime: '',
                    endTime: '',
                    address: '',
                    city: '',
                    country: '',
                });
                navigate('/'); // Ana menüye yönlendir
            } else {
                alert(result.error || 'Something went wrong!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to register doctor. Please try again.');
        }
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="registration-container">
                <h1 className="registration-title">Add Me as Doctor</h1>
    
                {!isAuthenticated ? (
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                    />
                ) : (
                    <p className="auth-success">✅ Authentication Successful!</p>
                )}
    
                <form className="registration-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            disabled
                        />
                    </div>
    
                    {/* Diğer form elemanları yalnızca kullanıcı giriş yaptıysa görünür olacak */}
                    {isAuthenticated && (
                        <>
                            <div className="form-group">
                                <label htmlFor="fullname">Full Name:</label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    value={formData.fullname}
                                    disabled
                                />
                            </div>
    
                            <div className="form-group">
                                <label htmlFor="areaOfInterest">Area of Interest:</label>
                                <select
                                    id="areaOfInterest"
                                    name="areaOfInterest"
                                    value={formData.areaOfInterest}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Cardiology">Cardiology</option>
                                </select>
                            </div>
    
                            <div className="form-group">
                                <label>Available Days:</label>
                                <div className="checkbox-group">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                        <label key={day}>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange(day)}
                                                checked={formData.availableDays.includes(day)}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>
    
                            <div className="form-group">
                                <label>Available Hours:</label>
                                <div className="time-inputs">
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
    
                            <div className="form-group">
                                <label htmlFor="address">Address:</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                />
                            </div>
    
                            <div className="form-group">
                                <label htmlFor="country">Country:</label>
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Country</option>
                                    {Object.keys(countryCityMap).map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
    
                            <div className="form-group">
                                <label htmlFor="city">City:</label>
                                <select
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!formData.country}
                                >
                                    <option value="">Select City</option>
                                    {formData.country &&
                                        countryCityMap[formData.country].map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                </select>
                            </div>
    
                            <button type="submit" className="submit-button">Register</button>
                        </>
                    )}
                </form>
            </div>
        </GoogleOAuthProvider>
    );}

export default DoctorRegistrationForm;
