const mongoose = require('mongoose');

const phraseSchema = new mongoose.Schema({
  // --- The Core Data ---
  title: {
    type: String,
    required: [true, 'Please give this phrase a name'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  notation: {
    type: String,
    required: [true, 'ABC notation is required'],
    maxlength: [2000, 'Notation cannot be more than 2000 characters']
  },
  key: {
    type: String,
    required: true,
    default: 'C',
    trim: true,
    uppercase: true,
    maxlength: [5, 'Key cannot be more than 5 characters']
  },

  // --- Musical Context (Optional) ---
  artist: {
    type: String,
    trim: true,
    default: null,
    maxlength: [50, 'Artist name cannot be more than 50 characters']
  },
  source: {
    type: String, // Album, Song, or Jam Session
    trim: true,
    default: null,
    maxlength: [100, 'Source cannot be more than 100 characters']
  },

  // --- Organization ---
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters'],
    default: null
  },

  // --- Media ---
  audioLink: {
    type: String,
    match: [
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
      'Please use a valid URL'
    ],
    maxlength: [500, 'URL cannot be more than 500 characters'],
    default: null
  },

  // --- System ---
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster searching
phraseSchema.index({ title: 'text', tags: 'text', artist: 'text' });

module.exports = mongoose.model('Phrase', phraseSchema);