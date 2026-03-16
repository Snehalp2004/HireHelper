const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ================= TEMP STORAGE =================
// Store user temporarily until OTP verified
let tempUsers = {};

// ================= OTP GENERATOR =================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= EMAIL TRANSPORTER =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email_id, password } = req.body;

    // Check if already exists in DB
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email_id = $1",
      [email_id]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Store temporarily (NOT in DB)
    tempUsers[email_id] = {
      first_name,
      last_name,
      phone_number,
      email_id,
      password: hashedPassword,
      otp,
      otpExpiry
    };

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email_id,
      subject: "HireHelper OTP Verification",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`
    });

    res.status(201).json({
      message: "OTP sent to email. Please verify to complete registration."
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= VERIFY OTP =================
const verifyOTP = async (req, res) => {
  try {
    const { email_id, otp } = req.body;

    const user = tempUsers[email_id];

    if (!user) {
      return res.status(400).json({ message: "No registration found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Insert into database AFTER verification
    await pool.query(
      `INSERT INTO users 
       (first_name, last_name, phone_number, email_id, password, is_verified)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [
        user.first_name,
        user.last_name,
        user.phone_number,
        user.email_id,
        user.password
      ]
    );

    // Remove from temp storage
    delete tempUsers[email_id];

    res.json({ message: "Account verified & registered successfully" });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email_id = $1",
      [email_id]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { registerUser, loginUser, verifyOTP };