const express = require('express');
const router = express.Router();
const {
  getPhrases,
  getPhraseById,
  createPhrase,
  updatePhrase,
  deletePhrase,
} = require('../controllers/phraseController');

// Middleware to protect routes (Valid JWT required)
const { protect } = require('../middleware/authMiddleware');

// Route: /api/phrases
router.route('/')
  .get(protect, getPhrases)    // Get all (User's)
  .post(protect, createPhrase); // Create new

// Route: /api/phrases/:id
router.route('/:id')
  .get(protect, getPhraseById)    // Get one
  .put(protect, updatePhrase)     // Update
  .delete(protect, deletePhrase); // Delete

module.exports = router;