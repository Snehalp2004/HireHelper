const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { createTask, getMyTasks, getFeedTasks, requestTask, getIncomingRequests, getMyAppliedTasks, updateRequestStatus, updateTask, deleteTask, toggleTaskStatus, replyToRequest } = require('../controllers/tasks.controller');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, createTask);

// @route   GET /api/tasks/my
// @desc    Get user's tasks
// @access  Private
router.get('/my', auth, getMyTasks);

// @route   GET /api/tasks/incoming-requests
// @desc    Get requests people have sent to help with MY tasks
// @access  Private
router.get('/incoming-requests', auth, getIncomingRequests);

// @route   GET /api/tasks/my-applied
// @desc    Get tasks I have requested to help with
// @access  Private
router.get('/my-applied', auth, getMyAppliedTasks);

// @route   POST /api/tasks/request
// @desc    Request to help with a task
// @access  Private
router.post('/request', auth, requestTask);

// @route   PUT /api/tasks/request/:request_id
// @desc    Accept or reject a request
// @access  Private
router.put('/request/:request_id', auth, updateRequestStatus);

// @route   POST /api/tasks/request/:request_id/reply
// @desc    Reply to a received request via email
// @access  Private
router.post('/request/:request_id/reply', auth, replyToRequest);

// @route   PUT /api/tasks/:id/status
// @desc    Toggle task status (open/closed)
// @access  Private
router.put('/:id/status', auth, toggleTaskStatus);

// @route   PUT /api/tasks/:id
// @desc    Edit a task
// @access  Private
router.put('/:id', auth, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, deleteTask);

// @route   GET /api/tasks
// @desc    Get all tasks excluding own
// @access  Private
router.get('/', auth, getFeedTasks);

module.exports = router;
