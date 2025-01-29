const express = require('express');
const { bookAppointment } = require('../controllers/appointmentsController');
const router = express.Router();

// Randevu oluşturma endpoint'i
router.post('/book', bookAppointment);

module.exports = router;
