const Comment = require('../models/commentModel.js');
const User = require('../models/userModel.js');
const Photo = require('../models/photoModel.js');

module.exports = {
  createComment: async function (req, res) {
    try {
      const { content, photoId } = req.body;      
      if (!req.body.postedBy) {
        console.log("ntotototoot"); // Check the value of req.body.photoId
        return res.status(401).json({ error: 'User not logged in' });
      }
      if (!content) {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      const comment = await Comment.create({ content, photo: photoId, postedBy: req.body.postedBy });

      // Update the user's comments array
      await User.findByIdAndUpdate(req.body.postedBy, { $push: { comments: comment._id } });

      // Update the photo's comments array
      await Photo.findByIdAndUpdate(photoId, { $push: { comments: comment._id } });

      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  },

  // Get a specific comment by its ID
  getComment: async function (req, res) {
    console.log("comment got");
    try {
      const { commentId } = req.params;
      const comment = await Comment.findById(commentId);
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to get comment' });
    }
  },

  // Update a specific comment
  updateComment: async function (req, res) {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const updatedComment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });
      res.json(updatedComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update comment' });
    }
  },

  // Delete a specific comment
  deleteComment: async function (req, res) {
    try {
      const { commentId } = req.params;

      // Find the comment
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      // Retrieve the associated photo and user IDs
      const { photo, postedBy } = comment;

      // Remove the comment from the comments collection
      await Comment.findByIdAndRemove(commentId);

      // Update the photo and user documents
      await Photo.findByIdAndUpdate(photo, { $pull: { comments: commentId } });
      await User.findByIdAndUpdate(postedBy, { $pull: { comments: commentId } });

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  },
};
