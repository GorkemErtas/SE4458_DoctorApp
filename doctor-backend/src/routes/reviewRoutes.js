const express = require('express');
const { submitReview } = require('../controllers/reviewController');
const router = express.Router();

// Yeni yorum ekleme
router.post('/', submitReview);

// Doktora ait yorumları getirme

module.exports = router;
