const express = require('express');
const cors = require('cors');

// Security Packages
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Middleware & Routes Imports
const { errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const phraseRoutes = require('./routes/phraseRoutes');

// Initialize the app
const app = express();

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after 10 minutes'
});
app.use('/api', limiter);

// Standard Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Body parser with size limit

// Data Sanitization
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS
app.use(hpp()); // Prevent Parameter Pollution

// Routes
// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'The Licktionary API is running 🎷' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/phrases', phraseRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;