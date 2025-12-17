const Phrase = require('../models/Phrase');

// @desc    Get all phrases (with filters)
// @route   GET /api/phrases
// @access  Private
const getPhrases = async (req, res) => {
  try {
    const match = {};

    match.user = req.user.id;

    // Optional Filters (from Query Params)
    // Example URL: /api/phrases?key=C&tag=bebop
    if (req.query.key) {
      match.key = req.query.key;
    }

    if (req.query.tag) {
      match.tags = req.query.tag;
    }

    if (req.query.artist) {
      // Case-insensitive regex search for artist
      match.artist = { $regex: req.query.artist, $options: 'i' };
    }

    const phrases = await Phrase.find(match).sort({ createdAt: -1 });

    res.status(200).json(phrases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single phrase
// @route   GET /api/phrases/:id
// @access  Private
const getPhraseById = async (req, res) => {
  try {
    const phrase = await Phrase.findById(req.params.id);

    if (!phrase) {
      return res.status(404).json({ message: 'Phrase not found' });
    }

    // Check Authorization: Allow if Owner OR if Public
    if (phrase.user.toString() !== req.user.id && !phrase.isPublic) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(phrase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new phrase
// @route   POST /api/phrases
// @access  Private
const createPhrase = async (req, res) => {
  try {
    
    const phraseData = {
      ...req.body,
      user: req.user.id
    };

    const phrase = await Phrase.create(phraseData);

    res.status(201).json(phrase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update phrase
// @route   PUT /api/phrases/:id
// @access  Private
const updatePhrase = async (req, res) => {
  try {
    const phrase = await Phrase.findById(req.params.id);

    if (!phrase) {
      return res.status(404).json({ message: 'Phrase not found' });
    }

    // Check User Ownership
    if (phrase.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this phrase' });
    }

    // Update
    const updatedPhrase = await Phrase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the new version & check validations
    );

    res.status(200).json(updatedPhrase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete phrase
// @route   DELETE /api/phrases/:id
// @access  Private
const deletePhrase = async (req, res) => {
  try {
    const phrase = await Phrase.findById(req.params.id);

    if (!phrase) {
      return res.status(404).json({ message: 'Phrase not found' });
    }

    // Check User Ownership
    if (phrase.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this phrase' });
    }

    await phrase.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPhrases,
  getPhraseById,
  createPhrase,
  updatePhrase,
  deletePhrase,
};