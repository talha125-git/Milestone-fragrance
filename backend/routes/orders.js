import express from 'express';

const router = express.Router();

const orders = [
  {
    id: 'ORD-8942',
    customer: 'Hamza Tariq',
    email: 'hamza.tariq@gmail.com',
    phone: '+92 321 8492019',
    city: 'Lahore, DHA Phase 5',
    items: [{ id: 'ghanam', name: 'Ghanam رنگ', qty: 1, size: '50ml', price: 6499 }],
    total: 6499,
    payment: 'Cash on Delivery',
    status: 'Processing',
    date: 'Today, 11:20 AM',
    createdAt: '2026-11-07T06:20:00Z',
  },
  {
    id: 'ORD-8941',
    customer: 'Zainab Fatima',
    email: 'zainab.f@outlook.com',
    phone: '+92 300 4582910',
    city: 'Karachi, Clifton Block 4',
    items: [
      { id: 'believe', name: 'Believe', qty: 1, size: '50ml', price: 6499 },
      { id: 'professor', name: 'Professor', qty: 1, size: '50ml', price: 6499 },
    ],
    total: 12998,
    payment: 'Direct Bank Transfer',
    status: 'Shipped',
    date: 'Yesterday, 04:45 PM',
    createdAt: '2026-11-06T11:45:00Z',
  },
  {
    id: 'ORD-8940',
    customer: 'Bilal Ahmed Khan',
    email: 'bilal.khan@yahoo.com',
    phone: '+92 333 1928374',
    city: 'Islamabad, F-7/2',
    items: [{ id: 'signature', name: 'Signature art. 023', qty: 2, size: '50ml', price: 12998 }],
    total: 12998,
    payment: 'Cash on Delivery',
    status: 'Delivered',
    date: 'Nov 05, 2026',
    createdAt: '2026-11-05T09:10:00Z',
  },
  {
    id: 'ORD-8939',
    customer: 'Mariam Siddiqui',
    email: 'mariam.sidd@gmail.com',
    phone: '+92 345 9928123',
    city: 'Rawalpindi, Bahria Town',
    items: [{ id: 'ghanam', name: 'Ghanam رنگ', qty: 1, size: '50ml', price: 6499 }],
    total: 6499,
    payment: 'Credit Card / Visa',
    status: 'Delivered',
    date: 'Nov 04, 2026',
    createdAt: '2026-11-04T15:30:00Z',
  },
  {
    id: 'ORD-8938',
    customer: 'Usman Ghani',
    email: 'usman.ghani@live.com',
    phone: '+92 312 7729104',
    city: 'Peshawar, Hayatabad',
    items: [{ id: 'professor', name: 'Professor', qty: 1, size: '50ml', price: 6499 }],
    total: 6499,
    payment: 'Cash on Delivery',
    status: 'Pending',
    date: 'Nov 04, 2026',
    createdAt: '2026-11-04T12:00:00Z',
  },
];

/**
 * GET /api/orders
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * POST /api/orders
 * Create new customer order
 */
router.post('/', (req, res) => {
  try {
    const { customer, email, phone, city, items, total, payment } = req.body;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customer || 'Guest Customer',
      email: email || 'customer@gmail.com',
      phone: phone || '+92 300 0000000',
      city: city || 'Pakistan',
      items: items || [],
      total: total || 6499,
      payment: payment || 'Cash on Delivery',
      status: 'Pending',
      date: 'Just now',
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

/**
 * PUT /api/orders/:id
 * Update order status
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (status) {
    order.status = status;
  }

  res.json({
    success: true,
    message: `Order ${id} status updated to ${status}`,
    data: order,
  });
});

export default router;

