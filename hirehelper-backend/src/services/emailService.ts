import nodemailer from 'nodemailer';
import { getTransporter, clientUrl } from '../config/email.config';

export const sendVerificationOTP = async (email: string, otp: string) => {
    const mailOptions = {
        from: '"HireHelper" <no-reply@hirehelper.dev>',
        to: email,
        subject: 'Your Verification OTP - HireHelper',
        text: `Your OTP for registration is: ${otp}. It expires in 5 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #1e293b; margin-bottom: 8px;">Welcome to HireHelper!</h2>
                <p style="color: #64748b;">Use the OTP below to verify your email address:</p>
                <div style="background: #f1f5f9; border-radius: 6px; padding: 20px; text-align: center; margin: 24px 0;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0f172a;">${otp}</span>
                </div>
                <p style="color: #94a3b8; font-size: 13px;">This OTP expires in <strong>5 minutes</strong>. If you didn't request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        const transport = await getTransporter();
        await transport.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

export const sendPasswordResetLink = async (email: string, token: string) => {
    const resetLink = `${clientUrl}/reset-password?token=${token}`;

    const mailOptions = {
        from: '"HireHelper" <no-reply@hirehelper.dev>',
        to: email,
        subject: 'Password Reset Request - HireHelper',
        text: `Click the link to reset your password: ${resetLink}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #1e293b;">Reset Your Password</h2>
                <p style="color: #64748b;">Click the button below to reset your HireHelper account password.</p>
                <a href="${resetLink}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #3b82f6; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">Reset Password</a>
                <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">If you didn't request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        const transport = await getTransporter();
        await transport.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};
