import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [approvedDoctors, setApprovedDoctors] = useState([]);

    useEffect(() => {
        // Pending doktorları al
        const fetchPendingDoctors = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/doctors/pending');
                const data = await response.json();
                setPendingDoctors(data);
            } catch (error) {
                console.error('Error fetching pending doctors:', error);
            }
        };

        fetchPendingDoctors();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin'); // Giriş durumunu temizle
        navigate('/'); // Ana sayfaya yönlendir
    };

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/doctors/approve/${id}`, {
                method: 'PUT',
            });

            if (response.ok) {
                alert('Doctor approved successfully!');
                // Pending listesinden çıkar ve Approved listesine ekle
                const approvedDoctor = pendingDoctors.find((doctor) => doctor.id === id);
                setPendingDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
                setApprovedDoctors((prev) => [...prev, approvedDoctor]);
            } else {
                alert('Failed to approve doctor.');
            }
        } catch (error) {
            console.error('Error approving doctor:', error);
            alert('An error occurred while approving the doctor.');
        }
    };

    return (
        <div className="admin-panel-container">
            <div className="admin-header">
                <h1 className="admin-title">Admin Panel</h1>
                <button
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>
            </div>
            <div className="admin-content">
                <h2 className="content-title">Pending Doctor Approvals</h2>
                <div className="approval-list">
                    {pendingDoctors.length === 0 ? (
                        <p>No pending approvals at the moment.</p>
                    ) : (
                        pendingDoctors.map((doctor) => (
                            <div key={doctor.id} className="approval-item">
                                <p>{doctor.fullname}</p>
                                <button
                                    onClick={() => handleApprove(doctor.id)}
                                    className="approve-button"
                                >
                                    Approve
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <h2 className="content-title">Approved Doctors</h2>
                <div className="approved-list">
                    {approvedDoctors.length === 0 ? (
                        <p>No doctors approved yet.</p>
                    ) : (
                        approvedDoctors.map((doctor) => (
                            <div key={doctor.id} className="approved-item">
                                <p>{doctor.fullname}</p>
                                <span className="approved-status">Approved</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
