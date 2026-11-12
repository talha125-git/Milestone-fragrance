import express from 'express';

const router = express.Router();

const messages = [
  {
    id: 'MSG-101',
    name: 'Saad Malik',
    email: 'saad.malik@gmail.com',
    phone: '+92 321 8492019',
    subject: 'Wholesale / Corporate Gifting Inquiry',
    message: 'Hello Milestone team, we are looking to place a bulk order of 50 units of Ghanam Royal Reserve for our corporate anniversary. Do you offer custom gift packaging?',
    receivedAt: '2026-11-06T10:30:00Z',
    replied: false,
  },
  {
    id: 'MSG-102',
    name: 'Dr. Ayesha Noor',
    email: 'ayesha.noor@hospital.edu.pk',
    phone: '+92 300 4582910',
    subject: 'Tester & Discovery Sample Set',
    message: 'Are you planning to launch discovery sample vials for Believe and Signature? Would love to sample both before ordering the full 100ml bottles.',
    receivedAt: '2026-11-05T16:15:00Z',
    replied: true,
  },
];

/**
 * GET /api/contact
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: messages.length,
    data: messages,
  });
});

/**
 * POST /api/contact
 * Body: { name, email, phone, subject, message }
 */
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields',
      });
    }

    const newMessage = {
      id: `MSG-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      receivedAt: new Date().toISOString(),
      replied: false,
    };

    messages.unshift(newMessage);

    res.json({
      success: true,
      message: 'Thank you for contacting Milestone Fragrance. Our fragrance concierge will reply within 24 hours.',
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact inquiry',
      error: error.message,
    });
  }
});

/**
 * PUT /api/contact/:id
 * Toggle replied status
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const msg = messages.find((m) => m.id === id);
  if (!msg) {
    return res.status(404).json({ success: false, message: 'Message not found' });
  }
  if (req.body.replied !== undefined) {
    msg.replied = Boolean(req.body.replied);
  }
  res.json({ success: true, data: msg });
});

/**
 * DELETE /api/contact/:id
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const idx = messages.findIndex((m) => m.id === id);
  if (idx !== -1) {
    messages.splice(idx, 1);
  }
  res.json({ success: true, message: 'Message deleted' });
});

export default router;

