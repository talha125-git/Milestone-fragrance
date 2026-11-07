import express from 'express';
import { products } from '../data/products.js';

const router = express.Router();

/**
 * GET /api/products
 * Query Params:
 *  - gender: 'Men' | 'Women' | 'Unisex'
 *  - type: 'Woody' | 'Fresh' | 'Citrus' | ...
 *  - bestseller: 'true'
 *  - search: keyword search in name, tagline, description, notes
 *  - sort: 'price-low' | 'price-high' | 'rating'
 */
router.get('/', (req, res) => {
  try {
    let result = [...products];
    const { gender, type, bestseller, search, sort } = req.query;

    // Filter by gender
    if (gender && gender !== 'all') {
      result = result.filter(
        (p) =>
          p.gender.toLowerCase() === gender.toLowerCase() ||
          p.gender.toLowerCase() === 'unisex'
      );
    }

    // Filter by fragrance type
    if (type && type !== 'all') {
      result = result.filter(
        (p) => p.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Filter by best seller flag
    if (bestseller === 'true') {
      result = result.filter((p) => p.bestSeller);
    }

    // Search keyword
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          (p.topNotes && p.topNotes.some((n) => n.toLowerCase().includes(q))) ||
          (p.heartNotes && p.heartNotes.some((n) => n.toLowerCase().includes(q))) ||
          (p.baseNotes && p.baseNotes.some((n) => n.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
});

/**
 * GET /api/products/bestsellers
 */
router.get('/bestsellers', (req, res) => {
  try {
    const bestSellers = products.filter((p) => p.bestSeller);
    res.json({
      success: true,
      count: bestSellers.length,
      data: bestSellers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bestsellers',
      error: error.message,
    });
  }
});

/**
 * GET /api/products/:id
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const product = products.find(
      (p) => p.id.toLowerCase() === id.toLowerCase()
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id '${id}' not found`,
      });
    }

    // Also send related products
    const related = products
      .filter((p) => p.id !== product.id)
      .slice(0, 3);

    res.json({
      success: true,
      data: product,
      related,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product details',
      error: error.message,
    });
  }
});

export default router;

