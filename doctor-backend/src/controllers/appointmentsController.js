const db = require('../db');
const nodemailer = require('nodemailer');

exports.bookAppointment = (req, res) => {
    const { name, email, date, time, doctorId } = req.body;

    const query = `
        INSERT INTO appointments (patient_name, patient_email, appointment_date, appointment_time, doctor_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [name, email, date, time, doctorId], (err, result) => {
        if (err) {
            console.error('Appointment booking failed:', err);
            return res.status(500).json({ error: 'Failed to book appointment' });
        }

        sendReviewEmail(name, email, doctorId);
        res.status(201).json({ message: 'Appointment booked successfully!' });
    });
};

const sendReviewEmail = (name, email, doctorId) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'akrepgorkem2002@gmail.com', // Gmail hesabınız
            pass: 'mfdb fyzl ssui sssl', // Gmail şifreniz (veya uygulama şifresi)
        },
    });

    const reviewLink = `http://localhost:3000/review/${doctorId}`;
    const mailOptions = {
        from: 'akrepgorkem2002@gmail.com',
        to: email,
        subject: 'Rate Your Doctor Appointment',
        html: `
            <h2>Thank you for your appointment, ${name}!</h2>
            <p>We hope your visit was great. Please take a moment to rate your experience with your doctor.</p>
            <a href="${reviewLink}" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Rate Your Visit</a>
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error('Error sending email:', err);
        else console.log('Review email sent:', info.response);
    });
};
