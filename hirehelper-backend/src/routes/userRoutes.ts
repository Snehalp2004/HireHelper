import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/db';
import { updateProfile, updateSettings } from '../controllers/userController';

const router = Router();

// GET /api/users/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT id, first_name, last_name, email_id, bio, professional_title FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/users/profile
router.put('/profile', authMiddleware, updateProfile);

// PUT /api/users/settings
router.put('/settings', authMiddleware, updateSettings);

export default router;
