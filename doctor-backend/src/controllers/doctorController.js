const db = require('../db');

// Doktor kaydı
exports.addDoctor = (req, res) => {
    const { email, fullname, areaOfInterest, availableDays, startTime, endTime, address, city, country } = req.body;

    const query = `
        INSERT INTO doctor_db (email, fullname, area_of_interest, available_days, start_time, end_time, address, city, country, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const values = [
        email,
        fullname,
        areaOfInterest,
        JSON.stringify(availableDays),
        startTime,
        endTime,
        address,
        city,
        country,
    ];

    db.query(query, values, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Doktor kaydı başarısız.' });
        } else {
            res.status(201).json({ message: 'Doktor başarıyla kaydedildi!' });
        }
    });
};

// Onay bekleyen doktorları getir
exports.getPendingDoctors = (req, res) => {
    const query = `SELECT * FROM doctor_db WHERE status = 'pending'`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Bekleyen doktorlar alınamadı.' });
        } else {
            res.status(200).json(results);
        }
    });
};

// Doktoru onayla
exports.approveDoctor = (req, res) => {
    const { id } = req.params;

    const query = `UPDATE doctor_db SET status = 'approved' WHERE id = ?`;

    db.query(query, [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to approve doctor' });
        } else {
            res.status(200).json({ message: 'Doctor approved successfully!' });
        }
    });
};

exports.searchDoctors = (req, res) => {
    const { query, country, city, autocomplete } = req.query; // "autocomplete" parametresini ekledik

    let sqlQuery = 'SELECT * FROM doctor_db WHERE status = "approved"';
    const params = [];

    if (query) {
        // Eğer autocomplete özelliği kullanılıyorsa sadece fullname ve area_of_interest döndür
        if (autocomplete === 'true') {
            sqlQuery = 'SELECT fullname, area_of_interest, city, country FROM doctor_db WHERE status = "approved" AND (fullname LIKE ? OR area_of_interest LIKE ?)';
            const searchQuery = `%${query}%`;
            params.push(searchQuery, searchQuery);
        } else {
            sqlQuery += ' AND (fullname LIKE ? OR area_of_interest LIKE ?)';
            const searchQuery = `%${query}%`;
            params.push(searchQuery, searchQuery);
        }
    }

    if (!autocomplete || autocomplete === 'false') {
        // Autocomplete sorgusu dışındaki durumlarda ülke ve şehir filtreleri
        if (country) {
            sqlQuery += ' AND country = ?';
            params.push(country);
        }

        if (city) {
            sqlQuery += ' AND city = ?';
            params.push(city);
        }
    }

    db.query(sqlQuery, params, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to search doctors' });
        } else {
            res.status(200).json(results);
        }
    });
};

exports.getDoctorDetails = (req, res) => {
    const id = req.params.id; // URL'den doktor ID'sini al

    const query = 'SELECT * FROM doctor_db WHERE id = ?'; // ID'ye göre doktoru seç
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to fetch doctor details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.status(200).json(results[0]); // İlk sonucu döndür
    });
};

