const express = require('express');
const cors = require('cors');

// Security Packages
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const app = express();

// Security Headers
// Helps secure by setting various HTTP headers
app.use(helmet());

// Rate Limiting
// Prevents brute-force attacks and DoS by limiting requests
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again after 10 minutes'
});
app.use('/api', limiter);

// Standard Middleware
app.use(cors());

// Body parser
app.use(express.json({ limit: '10kb' }));

// Data Sanitization
app.use(mongoSanitize());
app.use(xss());

// Prevents HPP attacks
app.use(hpp());

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'The Licktionary API is running 🎷' });
});

// Route Mounting (Uncomment these as we build them)
const authRoutes = require('./routes/authRoutes');
// const phraseRoutes = require('./routes/phraseRoutes');
app.use('/api/auth', authRoutes);
// app.use('/api/phrases', phraseRoutes);

module.exports = app;