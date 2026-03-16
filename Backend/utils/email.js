const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
    try {
        // We ensure we ONLY use the real Gmail SMTP configuration provided.
        // It strictly requires a valid SMTP_USER and an SMTP_PASS 
        // generated from Google Account App Passwords.
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
                            
        const info = await transporter.sendMail({
            from: `"Hire Helper OTP Verification" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        });
        
        console.log('\n----------------------------------------------------');
        console.log('✅ OTP EMAIL SUCCESSFULLY DISPATCHED TO THE REAL MAILBOX!');
        console.log(`✉️  Sent to: ${options.email}`);
        console.log(`🆔 Message ID: ${info.messageId}`);
        console.log('----------------------------------------------------\n');
        
        return true;
    } catch (error) {
        console.error('\n❌ CRITICAL: Error sending OTP email directly to Gmail.');
        console.error('Reason:', error.message);
        console.error('👉 Have you placed your 16-digit Google App Password inside the Backend/.env file yet?');
        return false;
    }
};

module.exports = sendEmail;

