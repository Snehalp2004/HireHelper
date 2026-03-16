const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const { Pool } = require('pg');
const sendEmail = require('../utils/email');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

exports.register = async (req, res) => {
    const { first_name, last_name, phone_number, email_id, password } = req.body;

    try {
        // 1. Check if user already exists
        const userResult = await pool.query('SELECT * FROM users WHERE email_id = $1', [email_id]);
        if (userResult.rows.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 4. Insert user into DB
        const newUserResult = await pool.query(
            `INSERT INTO users (first_name, last_name, phone_number, email_id, password, otp, otp_expiry) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, email_id`,
            [first_name, last_name, phone_number, email_id, hashedPassword, otp, otp_expiry]
        );

        const newUser = newUserResult.rows[0];

        // 5. Send OTP via Email using utility
        const emailSent = await sendEmail({
            email: email_id,
            subject: 'Verify your HireHelper Account',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Welcome to HireHelper!</h1>
          </div>
          <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #333;">Hi ${first_name},</p>
            <p style="font-size: 16px; color: #333;">Thank you for registering. Please use the following OTP to verify your account.</p>
            <div style="margin: 20px auto; padding: 15px; border-radius: 5px; background-color: #f4f4f4; border: 1px dashed #4CAF50; display: inline-block;">
              <h2 style="margin: 0; color: #4CAF50; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes.</p>
          </div>
        </div>
      `,
        });

        if (!emailSent) {
             return res.status(500).json({ msg: 'Failed to send OTP email.' });
        }

        res.status(201).json({ msg: 'User registered successfully. Please verify OTP sent to email.', user: newUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { email_id, password } = req.body;

    try {
        // 1. Check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email_id = $1', [email_id]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const user = userResult.rows[0];

        // 2. Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Check if verified
        if (!user.is_verified) {
            // Generate a fresh OTP just in case they lost the first one
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            await pool.query('UPDATE users SET otp = $1, otp_expiry = $2 WHERE id = $3', [otp, otp_expiry, user.id]);

            // Send Email using utility
            await sendEmail({
                email: email_id,
                subject: 'Verify your HireHelper Account - Fresh OTP',
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
                <h1 style="color: #fff; margin: 0;">Welcome back to HireHelper!</h1>
              </div>
              <div style="padding: 20px; text-align: center;">
                <p style="font-size: 16px; color: #333;">Hi ${user.first_name},</p>
                <p style="font-size: 16px; color: #333;">We noticed your account is not verified yet. Please use the following OTP to verify your account.</p>
                <div style="margin: 20px auto; padding: 15px; border-radius: 5px; background-color: #f4f4f4; border: 1px dashed #4CAF50; display: inline-block;">
                  <h2 style="margin: 0; color: #4CAF50; letter-spacing: 5px;">${otp}</h2>
                </div>
                <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes.</p>
              </div>
            </div>
          `,
            });

            return res.status(403).json({ msg: 'Unverified! A fresh OTP has been sent to your email.' });
        }

        // 4. Generate JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.encode(payload, process.env.JWT_SECRET);
        res.json({ token, user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email_id: user.email_id } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyOtp = async (req, res) => {
    const { email_id, otp } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email_id = $1', [email_id]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const user = userResult.rows[0];

        if (user.otp !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP' });
        }

        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ msg: 'OTP has expired' });
        }

        // Mark as verified and clear OTP
        await pool.query(
            'UPDATE users SET is_verified = TRUE, otp = NULL, otp_expiry = NULL WHERE email_id = $1',
            [email_id]
        );

        res.json({ msg: 'Email verified successfully. You can now login.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.forgotPassword = async (req, res) => {
    const { email_id } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email_id = $1', [email_id]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'No account found with this email address.' });
        }

        const user = userResult.rows[0];

        // Generate a fresh OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query('UPDATE users SET otp = $1, otp_expiry = $2 WHERE id = $3', [otp, otp_expiry, user.id]);

        // Send password reset email
        const emailSent = await sendEmail({
            email: email_id,
            subject: 'HireHelper - Password Reset OTP',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4CAF50; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #333;">Hi ${user.first_name},</p>
            <p style="font-size: 16px; color: #333;">We received a request to reset your password. Use the OTP below to proceed.</p>
            <div style="margin: 20px auto; padding: 15px; border-radius: 5px; background-color: #f4f4f4; border: 1px dashed #4CAF50; display: inline-block;">
              <h2 style="margin: 0; color: #4CAF50; letter-spacing: 5px;">${otp}</h2>
            </div>
            <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `,
        });

        if (!emailSent) {
            return res.status(500).json({ msg: 'Failed to send reset OTP email.' });
        }

        res.json({ msg: 'A password reset OTP has been sent to your email.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.resetPassword = async (req, res) => {
    const { email_id, otp, new_password, confirm_password } = req.body;

    if (!email_id || !otp || !new_password || !confirm_password) {
        return res.status(400).json({ msg: 'All fields are required.' });
    }

    if (new_password !== confirm_password) {
        return res.status(400).json({ msg: 'Passwords do not match.' });
    }

    if (new_password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters.' });
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email_id = $1', [email_id]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'User not found.' });
        }

        const user = userResult.rows[0];

        if (user.otp !== otp) {
            return res.status(400).json({ msg: 'Invalid OTP.' });
        }

        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        await pool.query(
            'UPDATE users SET password = $1, otp = NULL, otp_expiry = NULL WHERE email_id = $2',
            [hashedPassword, email_id]
        );

        res.json({ msg: 'Password reset successfully. You can now login with your new password.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
