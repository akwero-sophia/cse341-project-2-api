const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// GET all authors
exports.getAllAuthors = async (req, res) => {
  try {
    const db = getDB();
    const authors = await db.collection('authors').find().toArray();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch authors', message: error.message });
  }
};

// GET single author
exports.getAuthorById = async (req, res) => {
  try {
    const db = getDB();
    const authorId = req.params.id;

    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID format' });
    }

    const author = await db.collection('authors').findOne({ _id: new ObjectId(authorId) });
    
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch author', message: error.message });
  }
};

// CREATE author
exports.createAuthor = async (req, res) => {
  try {
    // Validation
    const { name, email, birthYear, nationality } = req.body;

    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Name and email are required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Invalid email format' 
      });
    }

    const db = getDB();
    
    // Check for duplicate email
    const existingAuthor = await db.collection('authors').findOne({ email });
    if (existingAuthor) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Author with this email already exists' 
      });
    }

    const newAuthor = {
      name,
      email,
      birthYear: birthYear || null,
      nationality: nationality || 'Unknown',
      createdAt: new Date()
    };

    const result = await db.collection('authors').insertOne(newAuthor);
    res.status(201).json({ 
      message: 'Author created successfully', 
      id: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create author', message: error.message });
  }
};

// UPDATE author
exports.updateAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;

    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID format' });
    }

    const { name, email, birthYear, nationality } = req.body;

    if (!name && !email && !birthYear && !nationality) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'At least one field is required to update' 
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          message: 'Invalid email format' 
        });
      }
    }

    const db = getDB();
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (birthYear) updateData.birthYear = birthYear;
    if (nationality) updateData.nationality = nationality;
    updateData.updatedAt = new Date();

    const result = await db.collection('authors').updateOne(
      { _id: new ObjectId(authorId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json({ message: 'Author updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update author', message: error.message });
  }
};

// DELETE author
exports.deleteAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;

    if (!ObjectId.isValid(authorId)) {
      return res.status(400).json({ error: 'Invalid author ID format' });
    }

    const db = getDB();
    const result = await db.collection('authors').deleteOne({ _id: new ObjectId(authorId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete author', message: error.message });
  }
};