import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import newsletterRouter from './routes/newsletter.js';
import contactRouter from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/contact', contactRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Milestone Fragrance API',
    version: '1.0.0',
    endpoints: [
      'GET  /api/products',
      'GET  /api/products/:id',
      'GET  /api/products/bestsellers',
      'GET  /api/categories',
      'GET  /api/categories/:id',
      'GET  /api/categories/meta/testimonials',
      'POST /api/newsletter',
      'POST /api/contact',
    ],
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Milestone Fragrance Express API',
    healthCheck: '/api/health',
    documentation: '/api/products',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? null : err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`\n💎 Milestone Fragrance API Server running at http://localhost:${PORT}`);
  // console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
  // console.log(`👉 Products API: http://localhost:${PORT}/api/products\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is currently in use.`);
    console.error(`👉 To free port ${PORT}, run in PowerShell:`);
    console.error(`   Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force`);
    console.error(`👉 Or specify another port in backend/.env (e.g. PORT=5001)\n`);
    process.exit(1);
  } else {
    console.error('[Server listen error]:', err);
  }
});

