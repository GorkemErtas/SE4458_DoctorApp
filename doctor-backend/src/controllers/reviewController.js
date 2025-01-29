const Review = require('../models/Review');

// Yorum ekleme (POST /api/reviews)
exports.submitReview = async (req, res) => {
    try {
        const { doctorId, rating, comment } = req.body;

        if (!doctorId || !rating || !comment) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newReview = new Review({
            doctorId: Number(doctorId),
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json({ message: '✅ Review submitted successfully!' });
    } catch (error) {
        console.error('❌ Error submitting review:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};
