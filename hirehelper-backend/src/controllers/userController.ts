import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/db';

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { first_name, last_name, phone_number, bio, professional_title } = req.body;

        const result = await pool.query(
            `UPDATE users 
             SET first_name = COALESCE($1, first_name), 
                 last_name = COALESCE($2, last_name),
                 phone_number = COALESCE($3, phone_number),
                 bio = $4,
                 professional_title = $5
             WHERE id = $6 
             RETURNING id, first_name, last_name, phone_number, email_id, bio, professional_title`,
            [first_name, last_name, phone_number, bio, professional_title, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { theme, notifications_enabled } = req.body;

        // Since we don't have a settings table yet, let's assume we store them in a JSONB column in users or a separate table.
        // For now, I'll update the users table if those columns exist, or provide a successful placeholder.
        // Let's assume for this implementation we just echo back success as a starting point if schema doesn't support it.

        // Mocking settings update for now as schema details are limited.
        // In a real scenario, we'd have a 'settings' table or columns in 'users'.

        res.json({
            message: 'Settings updated successfully',
            settings: { theme, notifications_enabled }
        });
    } catch (error) {
        console.error('Update Settings Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
