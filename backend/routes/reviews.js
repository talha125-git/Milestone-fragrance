import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reviewsFilePath = path.resolve(__dirname, '../data/reviews.json');

let reviews = [];

const saveReviewsToDisk = () => {
  try {
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Reviews] Failed to save reviews to disk:', err);
  }
};

try {
  if (fs.existsSync(reviewsFilePath)) {
    const raw = fs.readFileSync(reviewsFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      reviews = parsed;
    }
  } else {
    saveReviewsToDisk();
  }
} catch (e) {
  console.warn('[Reviews] Could not load reviews file:', e.message);
  reviews = [];
}

/**
 * GET /api/reviews
 * Query param: ?productId=signature
 */
router.get('/', (req, res) => {
  try {
    const { productId } = req.query;
    let list = [...reviews];
    if (productId) {
      list = list.filter((r) => r.productId?.toLowerCase() === productId.toLowerCase());
    }
    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/reviews
 * Body: { productId, productName, name, email, city, rating, title, comment, performance }
 */
router.post('/', (req, res) => {
  try {
    const { productId, productName, name, email, city, rating, title, comment, performance } = req.body;

    if (!productId || !name || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, customer name, and review comment are required.',
      });
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newReview = {
      id: `rev-${Date.now()}`,
      productId: String(productId).toLowerCase().trim(),
      productName: productName || 'Milestone Fragrance',
      name: name.trim(),
      email: email ? email.trim() : '',
      city: city ? city.trim() : 'Pakistan',
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      title: title ? title.trim() : 'Verified Customer Review',
      comment: comment.trim(),
      performance: performance || 'High Sillage & Longevity',
      verified: true,
      helpful: 1,
      date: formattedDate,
      createdAt: now.toISOString(),
    };

    reviews.unshift(newReview);
    saveReviewsToDisk();

    res.status(201).json({
      success: true,
      message: 'Review published successfully',
      data: newReview,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/reviews/:id/helpful
 */
router.post('/:id/helpful', (req, res) => {
  const { id } = req.params;
  const review = reviews.find((r) => r.id === id);
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  review.helpful = (review.helpful || 0) + 1;
  saveReviewsToDisk();
  res.json({ success: true, helpful: review.helpful });
});

export default router;

