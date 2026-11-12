import express from 'express';

const router = express.Router();

// Real initial subscriber entries
const subscribers = [
  { email: 'sarah.khan@gmail.com', date: '2026-11-07', status: 'Active' },
  { email: 'omar.farooq@outlook.com', date: '2026-11-06', status: 'Active' },
  { email: 'farah.jehangir@yahoo.com', date: '2026-11-05', status: 'Active' },
  { email: 'adnan.qureshi@tech.co', date: '2026-11-03', status: 'Active' },
  { email: 'maheen.t@icloud.com', date: '2026-11-01', status: 'Active' },
];

/**
 * GET /api/newsletter
 * List all subscribers
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: subscribers.length,
    data: subscribers,
  });
});

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

    const cleanEmail = email.trim().toLowerCase();
    const existing = subscribers.find((s) => s.email === cleanEmail);

    if (!existing) {
      const newSub = {
        email: cleanEmail,
        date: new Date().toISOString().split('T')[0],
        status: 'Active',
      };
      subscribers.unshift(newSub);
    }

    res.json({
      success: true,
      message: 'Thank you for subscribing! Your welcome discount code has been sent.',
      email: cleanEmail,
      count: subscribers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process newsletter subscription',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/newsletter/:email
 */
router.delete('/:email', (req, res) => {
  const { email } = req.params;
  const idx = subscribers.findIndex((s) => s.email.toLowerCase() === email.toLowerCase());
  if (idx !== -1) {
    subscribers.splice(idx, 1);
  }
  res.json({ success: true, message: 'Subscriber removed', count: subscribers.length });
});

export default router;

