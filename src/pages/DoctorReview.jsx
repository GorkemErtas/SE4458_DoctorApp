import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/DoctorReview.css';

const DoctorReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleRating = (value) => {
        setRating(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            doctorId: id,
            rating,
            comment,
        };

        try {
            const response = await fetch('http://localhost:5001/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => navigate('/'), 2000); // 2 saniye sonra ana sayfaya yönlendir
            } else {
                alert('Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="review-container">
            <h2>Rate Your Experience</h2>
            {submitted ? (
                <p>Thank you for your review! Redirecting to homepage...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? 'filled' : ''}`}
                                onClick={() => handleRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Leave a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                    <button type="submit">Submit Review</button>
                </form>
            )}
        </div>
    );
};

export default DoctorReview;
