const express = require('express');
const { addDoctor, getPendingDoctors, approveDoctor, searchDoctors, getDoctorDetails } = require('../controllers/doctorController');
const router = express.Router();

// Doktor kaydı
router.post('/register', addDoctor);

// Bekleyen doktorları getir
router.get('/pending', getPendingDoctors);

// Doktoru onayla
router.put('/approve/:id', approveDoctor);

router.get('/search', searchDoctors);

router.get('/autocomplete', searchDoctors);

router.get('/appointment/:id', getDoctorDetails);

module.exports = router;
