import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { products } from '../data/products.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const customProductsPath = path.resolve(__dirname, '../data/custom_products.json');

// Helper to save custom products
const saveCustomProducts = () => {
  try {
    const customList = products.filter(
      (p) => !['signature', 'believe', 'ghanam', 'professor'].includes(p.id)
    );
    fs.writeFileSync(customProductsPath, JSON.stringify(customList, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Products] Failed to save custom products:', err);
  }
};

// On start, merge any stored custom products
try {
  if (fs.existsSync(customProductsPath)) {
    const raw = fs.readFileSync(customProductsPath, 'utf-8');
    const customList = JSON.parse(raw);
    if (Array.isArray(customList)) {
      customList.forEach((cp) => {
        const existingIdx = products.findIndex((p) => p.id === cp.id);
        if (existingIdx !== -1) {
          products[existingIdx] = cp;
        } else {
          products.push(cp);
        }
      });
    }
  }
} catch (e) {
  console.warn('[Products] Could not read custom products:', e.message);
}

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
    const { gender, type, bestseller, newarrival, search, sort } = req.query;

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

    // Filter by new arrival flag
    if (newarrival === 'true') {
      result = result.filter((p) => p.isNewArrival);
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

/**
 * POST /api/products
 * Create a new product (Admin)
 */
router.post('/', (req, res) => {
  try {
    const {
      name,
      subtitle,
      tagline,
      description,
      price,
      originalPrice,
      gender,
      type,
      concentration,
      size,
      sizePrices,
      topNotes,
      heartNotes,
      baseNotes,
      inStock,
      stockQuantity,
      bestSeller,
      isNewArrival,
      image,
      longevity,
      sillage,
      howToApply,
      craftStory,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Product name and price are required',
      });
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

    const newProduct = {
      id,
      name,
      subtitle: subtitle || 'Milestone Edition',
      tagline: tagline || 'A distinguished luxury fragrance.',
      description: description || 'Artisanal perfume crafted with the finest natural extracts.',
      price: Number(price) || 6499,
      originalPrice: Number(originalPrice) || Number(price) + 1500,
      rating: 5,
      reviewsCount: 1,
      image: image || '/assets/prod_signature.png',
      gender: gender || 'Unisex',
      type: type || 'Woody',
      concentration: concentration || 'Eau De Parfum',
      size: size || '50ml / 1.7 fl.oz',
      sizePrices: (sizePrices && typeof sizePrices === 'object') ? sizePrices : {
        '100ml': Math.round((Number(price) || 6499) * 1.6),
        '50ml': Number(price) || 6499,
        '30ml': Math.round((Number(price) || 6499) * 0.65),
        '10ml': Math.round((Number(price) || 6499) * 0.35),
      },
      topNotes: Array.isArray(topNotes) ? topNotes : (topNotes ? topNotes.split(',').map(s => s.trim()) : ['Bergamot', 'Cardamom']),
      heartNotes: Array.isArray(heartNotes) ? heartNotes : (heartNotes ? heartNotes.split(',').map(s => s.trim()) : ['Cedarwood', 'Amber']),
      baseNotes: Array.isArray(baseNotes) ? baseNotes : (baseNotes ? baseNotes.split(',').map(s => s.trim()) : ['Oud', 'Musk']),
      bestSeller: Boolean(bestSeller),
      isNewArrival: Boolean(isNewArrival),
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 25,
      longevity: longevity || '12+ Hours',
      sillage: sillage || 'Strong Sillage',
      howToApply: howToApply || '',
      craftStory: craftStory || '',
    };

    products.push(newProduct);
    saveCustomProducts();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
});

/**
 * PUT /api/products/:id
 * Update an existing product (Admin)
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with id '${id}' not found`,
      });
    }

    const current = products[index];
    const updated = {
      ...current,
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : current.originalPrice,
      id: current.id, // prevent changing id
    };

    products[index] = updated;
    saveCustomProducts();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
});

/**
 * DELETE /api/products/:id
 * Delete a product (Admin)
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = products.findIndex((p) => p.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with id '${id}' not found`,
      });
    }

    const removed = products.splice(index, 1)[0];
    saveCustomProducts();

    res.json({
      success: true,
      message: `Product '${removed.name}' deleted successfully`,
      data: removed,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
});

export default router;

