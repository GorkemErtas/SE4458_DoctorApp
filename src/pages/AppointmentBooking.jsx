import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AppointmentBooking.css';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "400px",
};

// Varsayılan koordinatlar (İzmir merkez)
const defaultCenter = { lat: 38.4192, lng: 27.1287 };

const AppointmentBooking = () => {
    const { id } = useParams();
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [coordinates, setCoordinates] = useState(defaultCenter);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/doctors/appointment/${id}`);
                if (!response.ok) {
                    throw new Error(response.status === 404 ? 'Doctor not found' : 'Failed to fetch doctor details');
                }
                const data = await response.json();
                setDoctorDetails(data);

                if (data.city) {
                    fetchCoordinates(data.city);
                }
            } catch (error) {
                console.error('Error fetching doctor details:', error);
                setErrorMessage(error.message);
            }
        };

        fetchDoctorDetails();
    }, [id]);

    const fetchCoordinates = async (city) => {
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === "OK") {
                const location = data.results[0].geometry.location;
                setCoordinates({ lat: location.lat, lng: location.lng });
            } else {
                console.error("Geocoding API error:", data.status);
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateAppointment = (date, time) => {
        if (!doctorDetails) return false;

        const selectedDay = new Date(date).toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue", ...
        const selectedTime = time;

        const availableDays = doctorDetails.available_days || [];
        const startTime = doctorDetails.start_time;
        const endTime = doctorDetails.end_time;

        if (!availableDays.includes(selectedDay)) {
            setFormError(` The doctor is not available on ${selectedDay}.`);
            return false;
        }

        if (selectedTime < startTime || selectedTime > endTime) {
            setFormError(` The doctor is only available between ${startTime} - ${endTime}.`);
            return false;
        }

        setFormError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const appointmentData = {
            name: formData.get('name'),
            email: formData.get('email'),
            date: formData.get('date'),
            time: formData.get('time'),
            doctorId: id,
        };

        if (!validateAppointment(appointmentData.date, appointmentData.time)) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            if (response.ok) {
                alert(' Appointment booked successfully!');
                navigate('/');
            } else {
                alert(' Failed to book appointment. Please try again.');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert(' An error occurred. Please try again.');
        }
    };

    if (errorMessage) {
        return <p>{errorMessage}</p>;
    }

    if (!doctorDetails) {
        return null;
    }

    return (
        <div className="appointment-booking-container">
            <div className="doctor-info">
                <h1 className="doctor-name">{doctorDetails.fullname}</h1>
                <p><strong>Specialization:</strong> {doctorDetails.area_of_interest}</p>
                <p><strong>Address:</strong> {doctorDetails.address}</p>
                <p><strong>Available Days:</strong> {doctorDetails.available_days?.join(', ')}</p>
                <p><strong>Available Hours:</strong> {doctorDetails.start_time} - {doctorDetails.end_time}</p>
                <p><strong>City:</strong> {doctorDetails.city}</p>
                <p><strong>Country:</strong> {doctorDetails.country}</p>
            </div>

            <div className="map-and-booking">
                <div className="google-map">
                    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                        {loading ? (
                            <p>Loading map...</p>
                        ) : (
                            <GoogleMap mapContainerStyle={mapContainerStyle} center={coordinates} zoom={12}>
                                <Marker position={coordinates} />
                            </GoogleMap>
                        )}
                    </LoadScript>
                </div>

                <div className="booking-form">
                    <h2>Book an Appointment</h2>
                    {formError && <p className="error-message">{formError}</p>}
                    <form onSubmit={handleSubmit}>
                        <label>
                            Your Name:
                            <input type="text" name="name" required />
                        </label>
                        <label>
                            Your Email:
                            <input type="email" name="email" required />
                        </label>
                        <label>
                            Date:
                            <input type="date" name="date" required />
                        </label>
                        <label>
                            Time:
                            <input type="time" name="time" required />
                        </label>
                        <button type="submit">Book Appointment</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;
