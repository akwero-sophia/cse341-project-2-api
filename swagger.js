const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE341 Project 2 API',
      version: '1.0.0',
      description: 'REST API with CRUD operations for Books and Authors collections',
      contact: {
        name: 'Your Name',
        email: 'your.email@byui.edu'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-app.onrender.com',
        description: 'Production server',
      }
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;