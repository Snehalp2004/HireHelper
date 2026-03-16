const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// @route   GET api/users/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, first_name, last_name, email_id, phone_number, profile_picture, email_notifications FROM users WHERE id = $1', [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/me
// @desc    Update user profile & avatar
// @access  Private
router.put('/me', auth, upload.single('profile_picture'), async (req, res) => {
    let { first_name, last_name, email_id, phone_number, password } = req.body;
    let newProfilePic = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        let currentUser = userResult.rows[0];

        // Preserve existing data if not updated
        first_name = first_name || currentUser.first_name;
        last_name = last_name || currentUser.last_name;
        email_id = email_id || currentUser.email_id;
        phone_number = phone_number || currentUser.phone_number;
        newProfilePic = newProfilePic || currentUser.profile_picture;

        let hashedPassword = currentUser.password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const updatedUser = await pool.query(
            `UPDATE users SET first_name = $1, last_name = $2, email_id = $3, phone_number = $4, password = $5, profile_picture = $6 
             WHERE id = $7 RETURNING id, first_name, last_name, email_id, phone_number, profile_picture`,
            [first_name, last_name, email_id, phone_number, hashedPassword, newProfilePic, req.user.id]
        );

        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
    const { email_notifications } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET email_notifications = $1 WHERE id = $2 RETURNING email_notifications',
            [email_notifications, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
