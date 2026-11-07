import express from 'express';

const router = express.Router();

const messages = [];

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
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      receivedAt: new Date().toISOString(),
    };

    messages.push(newMessage);

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

export default router;

