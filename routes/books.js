const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ status: 'Published' }).sort({ createdAt: -1 });
    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured book
router.get('/featured', async (req, res) => {
  try {
    const featuredBook = await Book.findOne({ featured: true, status: 'Published' });
    if (!featuredBook) {
      return res.status(404).json({ error: 'No featured book found' });
    }
    res.json({ book: featuredBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;