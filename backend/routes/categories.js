import express from 'express';
import { fragranceTypes, testimonials } from '../data/products.js';

const router = express.Router();

/**
 * GET /api/categories
 * Returns all fragrance types/categories
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: fragranceTypes.length,
    data: fragranceTypes,
  });
});

/**
 * GET /api/categories/:id
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const category = fragranceTypes.find(
    (c) => c.id.toLowerCase() === id.toLowerCase()
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      message: `Category '${id}' not found`,
    });
  }

  res.json({
    success: true,
    data: category,
  });
});

/**
 * GET /api/testimonials
 */
router.get('/meta/testimonials', (req, res) => {
  res.json({
    success: true,
    count: testimonials.length,
    data: testimonials,
  });
});

export default router;

