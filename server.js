const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const { connectDB } = require('./config/db');
require('dotenv').config();

// NEW: Import session, passport, and mongoose
const session = require('express-session');
const passport = require('./config/passport');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// NEW: Session configuration (MUST come before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false // Set to true in production with HTTPS
    }
  })
);

// NEW: Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// NEW: Authentication Routes
app.use('/auth', require('./routes/auth'));

// Existing Routes
app.use('/books', require('./routes/books'));
app.use('/authors', require('./routes/authors'));

// Root route
app.get('/', (req, res) => {
  res.send('CSE341 Project 2 API - Visit /api-docs for documentation');
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB (original connection)
    await connectDB();
    
    // NEW: Connect Mongoose for User authentication
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Mongoose connected for authentication');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API Docs at http://localhost:${PORT}/api-docs`);
      console.log(`Login at http://localhost:${PORT}/auth/google`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();