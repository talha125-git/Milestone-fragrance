import express from 'express';

const router = express.Router();

// In-memory subscribers store (can be connected to MongoDB/PostgreSQL later)
const subscribers = new Set();

/**
 * POST /api/newsletter
 * Body: { email }
 */
router.post('/', (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required',
      });
    }

    subscribers.add(email.trim().toLowerCase());

    res.json({
      success: true,
      message: 'Thank you for subscribing! Your welcome discount code has been sent.',
      email: email.trim().toLowerCase(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process newsletter subscription',
      error: error.message,
    });
  }
});

export default router;

