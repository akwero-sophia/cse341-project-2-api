const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// GET all books
exports.getAllBooks = async (req, res) => {
  try {
    const db = getDB();
    const books = await db.collection('books').find().toArray();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch books', 
      message: error.message 
    });
  }
};

// GET single book by ID
exports.getBookById = async (req, res) => {
  try {
    const db = getDB();
    const bookId = req.params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ 
        error: 'Invalid book ID format' 
      });
    }

    const book = await db.collection('books').findOne({ 
      _id: new ObjectId(bookId) 
    });
    
    if (!book) {
      return res.status(404).json({ 
        error: 'Book not found' 
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch book', 
      message: error.message 
    });
  }
};

// CREATE new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, publishedYear, genre, pages } = req.body;

    // Validation: Required fields
    if (!title || !author || !isbn) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Title, author, and ISBN are required fields' 
      });
    }

    // Validation: Title length
    if (title.trim().length < 1) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Title cannot be empty' 
      });
    }

    // Validation: Author length
    if (author.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Author name must be at least 2 characters long' 
      });
    }

    // Validation: ISBN format (10 or 13 digits, hyphens allowed)
    const isbnClean = isbn.replace(/[-\s]/g, '');
    if (isbnClean.length < 10 || isbnClean.length > 13) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'ISBN must be between 10 and 13 characters (excluding hyphens)' 
      });
    }

    // Validation: Published year (if provided)
    if (publishedYear && (publishedYear < 1000 || publishedYear > new Date().getFullYear() + 1)) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Published year must be between 1000 and next year' 
      });
    }

    // Validation: Pages (if provided)
    if (pages && (pages < 1 || pages > 10000)) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Pages must be between 1 and 10000' 
      });
    }

    const db = getDB();
    
    // Check for duplicate ISBN
    const existingBook = await db.collection('books').findOne({ 
      isbn: isbnClean 
    });
    
    if (existingBook) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'A book with this ISBN already exists' 
      });
    }

    // Create book object
    const newBook = {
      title: title.trim(),
      author: author.trim(),
      isbn: isbnClean,
      publishedYear: publishedYear || null,
      genre: genre ? genre.trim() : 'Unknown',
      pages: pages || null,
      createdAt: new Date()
    };

    const result = await db.collection('books').insertOne(newBook);
    
    res.status(201).json({ 
      message: 'Book created successfully', 
      id: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to create book', 
      message: error.message 
    });
  }
};

// UPDATE book
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ 
        error: 'Invalid book ID format' 
      });
    }

    const { title, author, isbn, publishedYear, genre, pages } = req.body;

    // Validation: At least one field required
    if (!title && !author && !isbn && !publishedYear && !genre && !pages) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'At least one field is required to update' 
      });
    }

    // Validation: Title length (if provided)
    if (title && title.trim().length < 1) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Title cannot be empty' 
      });
    }

    // Validation: Author length (if provided)
    if (author && author.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Author name must be at least 2 characters long' 
      });
    }

    // Validation: ISBN format (if provided)
    if (isbn) {
      const isbnClean = isbn.replace(/[-\s]/g, '');
      if (isbnClean.length < 10 || isbnClean.length > 13) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          message: 'ISBN must be between 10 and 13 characters (excluding hyphens)' 
        });
      }

      const db = getDB();
      
      // Check for duplicate ISBN (excluding current book)
      const existingBook = await db.collection('books').findOne({ 
        isbn: isbnClean,
        _id: { $ne: new ObjectId(bookId) }
      });
      
      if (existingBook) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          message: 'A book with this ISBN already exists' 
        });
      }
    }

    // Validation: Published year (if provided)
    if (publishedYear && (publishedYear < 1000 || publishedYear > new Date().getFullYear() + 1)) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Published year must be between 1000 and next year' 
      });
    }

    // Validation: Pages (if provided)
    if (pages && (pages < 1 || pages > 10000)) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        message: 'Pages must be between 1 and 10000' 
      });
    }

    const db = getDB();
    const updateData = {};
    
    if (title) updateData.title = title.trim();
    if (author) updateData.author = author.trim();
    if (isbn) updateData.isbn = isbn.replace(/[-\s]/g, '');
    if (publishedYear) updateData.publishedYear = publishedYear;
    if (genre) updateData.genre = genre.trim();
    if (pages) updateData.pages = pages;
    updateData.updatedAt = new Date();

    const result = await db.collection('books').updateOne(
      { _id: new ObjectId(bookId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'Book not found' 
      });
    }

    res.status(200).json({ 
      message: 'Book updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to update book', 
      message: error.message 
    });
  }
};

// DELETE book
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Validate ObjectId format
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ 
        error: 'Invalid book ID format' 
      });
    }

    const db = getDB();
    const result = await db.collection('books').deleteOne({ 
      _id: new ObjectId(bookId) 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Book not found' 
      });
    }

    res.status(200).json({ 
      message: 'Book deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to delete book', 
      message: error.message 
    });
  }
};