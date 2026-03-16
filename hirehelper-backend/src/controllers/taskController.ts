import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';

export const createTask = async (req: AuthRequest, res: Response) => {
    const { title, description, location, start_time, end_time, picture_url } = req.body;
    const userId = req.user.id;

    if (!title || !start_time || !location) {
        return res.status(400).json({ message: 'Title, Start Time, and Location are required fields.' });
    }

    try {
        console.log(`Creating task for user: ${userId}`);
        const query = `
            INSERT INTO tasks (user_id, title, description, location, start_time, end_time, picture_url, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            userId,
            title,
            description || null,
            location,
            start_time,
            end_time || null,
            picture_url || null,
            'OPEN'
        ];
        const result = await pool.query(query, values);
        console.log('Task created successfully:', result.rows[0]);

        res.status(201).json({
            message: 'Task created successfully',
            task: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error while creating task' });
    }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (userId === undefined || userId === null) {
        return res.status(401).json({ message: 'Unauthorized: User ID missing from token' });
    }

    try {
        const query = `
            SELECT * FROM tasks 
            WHERE user_id = $1::integer 
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query, [userId]);

        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.status(200).json({
            tasks: result.rows
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error while fetching tasks' });
    }
};
export const getFeedTasks = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    try {
        const query = `
            SELECT * FROM tasks 
            WHERE user_id != $1::integer 
            AND status = 'OPEN'
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query, [userId || -1]); // Use -1 or similar if no user (though route is protected)

        res.status(200).json({
            tasks: result.rows
        });
    } catch (error) {
        console.error('Error fetching feed tasks:', error);
        res.status(500).json({ message: 'Server error while fetching feed tasks' });
    }
};
