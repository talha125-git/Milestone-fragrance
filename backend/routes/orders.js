import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.resolve(__dirname, '../data/orders.json');

// In-memory orders loaded from orders.json
let orders = [];

// Helper to save orders to disk
const saveOrdersToDisk = () => {
  try {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Orders] Failed to save orders to disk:', err);
  }
};

// On server start, load persistent orders
try {
  if (fs.existsSync(ordersFilePath)) {
    const raw = fs.readFileSync(ordersFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      orders = parsed;
    }
  } else {
    saveOrdersToDisk();
  }
} catch (e) {
  console.warn('[Orders] Could not read orders file, starting empty:', e.message);
  orders = [];
}

/**
 * GET /api/orders
 * List all customer orders
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * GET /api/orders/:id
 * Fetch single order by ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const order = orders.find((o) => o.id?.toLowerCase() === id?.toLowerCase());
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, data: order });
});

/**
 * POST /api/orders
 * Create new customer order from Checkout
 */
router.post('/', (req, res) => {
  try {
    const {
      customer,
      email,
      phone,
      city,
      address,
      postalCode,
      notes,
      items,
      subtotal,
      shipping,
      discount,
      couponCode,
      total,
      payment,
    } = req.body;

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const newOrder = {
      id: orderId,
      customer: customer ? customer.trim() : 'Valued Customer',
      email: email ? email.trim() : 'customer@milestone.pk',
      phone: phone ? phone.trim() : '+92 300 0000000',
      city: city ? city.trim() : 'Pakistan',
      address: address ? address.trim() : '',
      postalCode: postalCode ? postalCode.trim() : '',
      notes: notes ? notes.trim() : '',
      items: Array.isArray(items) ? items : [],
      subtotal: Number(subtotal) || Number(total) || 0,
      shipping: Number(shipping) || 0,
      discount: Number(discount) || 0,
      couponCode: couponCode || '',
      total: Number(total) || 0,
      payment: payment || 'Cash on Delivery',
      status: 'Pending',
      date: formattedDate,
      createdAt: now.toISOString(),
    };

    orders.unshift(newOrder);
    saveOrdersToDisk();

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
 * Update order status (Admin)
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const orderIndex = orders.findIndex((o) => o.id?.toLowerCase() === id?.toLowerCase());
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (status) {
    orders[orderIndex].status = status;
    saveOrdersToDisk();
  }

  res.json({
    success: true,
    message: `Order ${id} status updated to ${status}`,
    data: orders[orderIndex],
  });
});

/**
 * DELETE /api/orders/:id
 * Delete order (Admin)
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = orders.length;
  orders = orders.filter((o) => o.id?.toLowerCase() !== id?.toLowerCase());

  if (orders.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  saveOrdersToDisk();
  res.json({
    success: true,
    message: `Order ${id} deleted successfully`,
  });
});

export default router;
