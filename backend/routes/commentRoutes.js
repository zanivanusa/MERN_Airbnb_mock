var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController');

// Create a new comment
router.post('/', commentController.createComment);

// Get a specific comment by its ID
router.get('/:commentId', commentController.getComment);

// Update a specific comment
router.put('/:commentId', commentController.updateComment);

// Delete a specific comment
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
