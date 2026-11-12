import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const heroFilePath = path.resolve(__dirname, '../data/hero_settings.json');

const defaultSlides = [
  {
    id: 'ghanam',
    bgKey: 'ghanamHeroBg',
    bgImage: '/assets/ghanam_rang_hero_bg.png',
    tag: 'GHANAM RANGE • ORIENTAL HERITAGE',
    titleLine1: 'Ghanam Range',
    titleLine2: 'Crafted For Royalty',
    description: 'A rich oriental scent with a modern touch. Blended with exquisite Persian saffron, Damascus rose, and rare royal Cambodian oud.',
    notes: 'Saffron, Amber & Cambodian Oud',
    product: 'Ghanam Royal Reserve',
    price: 'Rs. 6,499',
  },
  {
    id: 'believe',
    bgKey: 'believeHeroBg',
    bgImage: '/assets/Believe_Hero_bg.png',
    tag: 'BELIEVE COLLECTION • FRESH & VIBRANT',
    titleLine1: 'Believe Collection',
    titleLine2: 'Fresh, Vibrant & Pure',
    description: 'Fresh, vibrant and long-lasting. An invigorating splash of Mediterranean citrus and sea salt, harmoniously grounded by aromatic bay leaf and amber.',
    notes: 'Marine Accord, Mandarin & Ambergris',
    product: 'Believe Pour Homme & Femme',
    price: 'Rs. 6,499',
  },
  {
    id: 'signature',
    bgKey: 'heroBg',
    bgImage: '/assets/hero_bg_image.png',
    tag: 'SIGNATURE SERIES • PREMIUM FRAGRANCES',
    titleLine1: 'Timeless Scents',
    titleLine2: 'For Every Moment',
    description: 'Discover the art of fragrance. Crafted for those who leave a lasting impression. A refined balance of warm woods, golden amber, and Italian bergamot.',
    notes: 'Warm Woods & Amber • Cedarwood & Oud',
    product: 'Signature art. 023',
    price: 'Rs. 6,499',
  },
  {
    id: 'professor',
    bgKey: 'professorHeroBg',
    bgImage: '/assets/professor_hero_bg.png',
    tag: 'PROFESSOR EDITION • BOLD & SOPHISTICATED',
    titleLine1: 'Professor Edition',
    titleLine2: 'A Scent That Defines Character',
    description: 'Bold, intelligent and sophisticated. Professor blends rich woody notes with black cardamom, smoked leather, and Madagascar amber for a magnetic impression.',
    notes: 'Black Cardamom, Smoked Leather & Amber',
    product: 'Professor Edition',
    price: 'Rs. 6,499',
  },
];

let slides = [...defaultSlides];

// Load from disk on startup
try {
  if (fs.existsSync(heroFilePath)) {
    const raw = fs.readFileSync(heroFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      slides = parsed;
    }
  } else {
    fs.writeFileSync(heroFilePath, JSON.stringify(defaultSlides, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('[Hero API] Could not read hero settings file:', e.message);
}

const saveHeroSlides = () => {
  try {
    fs.writeFileSync(heroFilePath, JSON.stringify(slides, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Hero API] Failed to save hero settings:', err);
  }
};

/**
 * GET /api/hero
 * Fetch all hero banner slides
 */
router.get('/', (req, res) => {
  try {
    if (fs.existsSync(heroFilePath)) {
      const raw = fs.readFileSync(heroFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        slides = parsed;
      }
    }
  } catch (e) {}

  res.json({
    success: true,
    count: slides.length,
    data: slides,
  });
});

/**
 * PUT /api/hero
 * Bulk update all hero slides
 */
router.put('/', (req, res) => {
  try {
    let newSlides = req.body;
    if (!Array.isArray(newSlides)) {
      if (typeof newSlides === 'object' && newSlides !== null) {
        newSlides = [newSlides];
      } else {
        return res.status(400).json({
          success: false,
          message: 'Request body must be a non-empty array of slides',
        });
      }
    }

    if (newSlides.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Slides array cannot be empty',
      });
    }

    slides = newSlides;
    saveHeroSlides();

    res.json({
      success: true,
      message: 'Hero banner slides updated successfully',
      data: slides,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update hero slides',
      error: err.message,
    });
  }
});

/**
 * PUT /api/hero/:id
 * Update a specific slide by id
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const index = slides.findIndex((s) => s.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Slide with id '${id}' not found`,
      });
    }

    slides[index] = {
      ...slides[index],
      ...req.body,
      id: slides[index].id, // keep immutable id
    };

    saveHeroSlides();

    res.json({
      success: true,
      message: `Slide '${id}' updated successfully`,
      data: slides[index],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update slide',
      error: err.message,
    });
  }
});

/**
 * POST /api/hero
 * Add a new slide to the hero banner
 */
router.post('/', (req, res) => {
  try {
    const {
      titleLine1,
      titleLine2,
      tag,
      description,
      notes,
      price,
      bgImage,
      bgKey,
      product,
    } = req.body;

    const id = `slide-${Date.now()}`;
    const newSlide = {
      id,
      titleLine1: titleLine1 || 'Milestone Fragrance',
      titleLine2: titleLine2 || 'Elegance Redefined',
      tag: tag || 'LUXURY ATELIER • EXCLUSIVE RELEASE',
      description: description || 'Handcrafted luxury perfumes with exceptional longevity and projection.',
      notes: notes || 'Warm Amber, Woods & Vanilla',
      product: product || 'Signature art. 023',
      price: price || 'Rs. 6,499',
      bgImage: bgImage || '/assets/hero_bg_image.png',
      bgKey: bgKey || 'heroBg',
    };

    slides.push(newSlide);
    saveHeroSlides();

    res.status(201).json({
      success: true,
      message: 'New hero slide added successfully',
      data: newSlide,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to add hero slide',
      error: err.message,
    });
  }
});

/**
 * DELETE /api/hero/:id
 * Remove a slide from the hero banner
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    if (slides.length <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the only remaining slide',
      });
    }

    const index = slides.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Slide with id '${id}' not found`,
      });
    }

    const removed = slides.splice(index, 1)[0];
    saveHeroSlides();

    res.json({
      success: true,
      message: 'Slide deleted successfully',
      data: removed,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete slide',
      error: err.message,
    });
  }
});

/**
 * POST /api/hero/reset
 * Reset hero slides to original defaults
 */
router.post('/reset', (req, res) => {
  try {
    slides = [...defaultSlides];
    saveHeroSlides();
    res.json({
      success: true,
      message: 'Hero slides reset to factory defaults',
      data: slides,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset slides',
      error: err.message,
    });
  }
});

export default router;
