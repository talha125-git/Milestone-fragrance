import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Destination folders for Products
const assetsProductimagesDir = path.resolve(__dirname, '../../frontend/src/assets/productimages');
const publicProductimagesDir = path.resolve(__dirname, '../../frontend/public/productimages');
const backendUploadsDir = path.resolve(__dirname, '../public/productimages');

// Destination folders for Hero Background Images
const assetsHeroImagesDir = path.resolve(__dirname, '../../frontend/src/assets/hero_bg_imgaes');
const publicHeroImagesDir = path.resolve(__dirname, '../../frontend/public/hero_bg_imgaes');
const backendHeroUploadsDir = path.resolve(__dirname, '../public/hero_bg_imgaes');

// Ensure all target directories exist
[
  assetsProductimagesDir,
  publicProductimagesDir,
  backendUploadsDir,
  assetsHeroImagesDir,
  publicHeroImagesDir,
  backendHeroUploadsDir,
].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isHero = req.query.type === 'hero' || req.body.type === 'hero';
    cb(null, isHero ? assetsHeroImagesDir : assetsProductimagesDir);
  },
  filename: (req, file, cb) => {
    const isHero = req.query.type === 'hero' || req.body.type === 'hero';
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_');
    const prefix = isHero ? 'hero_bg' : 'prod';
    const uniqueName = `${prefix}_${Date.now()}_${baseName}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, WEBP) are allowed'), false);
    }
  },
});

/**
 * POST /api/upload
 * Multi-part form-data file upload (field: 'image')
 * Query or body 'type=hero' routes to assets/hero_bg_imgaes
 */
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file was uploaded',
      });
    }

    const isHero = req.query.type === 'hero' || req.body.type === 'hero';
    const filename = req.file.filename;
    const sourcePath = req.file.path;

    if (isHero) {
      const publicDest = path.join(publicHeroImagesDir, filename);
      const backendDest = path.join(backendHeroUploadsDir, filename);
      try {
        fs.copyFileSync(sourcePath, publicDest);
        fs.copyFileSync(sourcePath, backendDest);
      } catch (copyErr) {
        console.warn('[Upload Hero] Notice while syncing to public dirs:', copyErr.message);
      }

      const publicUrl = `/hero_bg_imgaes/${filename}`;
      return res.json({
        success: true,
        message: 'Background image successfully stored in assets/hero_bg_imgaes',
        filename,
        url: publicUrl,
        assetPath: `assets/hero_bg_imgaes/${filename}`,
      });
    }

    // Default: Product image
    const publicDest = path.join(publicProductimagesDir, filename);
    const backendDest = path.join(backendUploadsDir, filename);

    try {
      fs.copyFileSync(sourcePath, publicDest);
      fs.copyFileSync(sourcePath, backendDest);
    } catch (copyErr) {
      console.warn('[Upload Product] Notice while syncing to public dirs:', copyErr.message);
    }

    const publicUrl = `/productimages/${filename}`;

    res.json({
      success: true,
      message: 'Product image successfully stored in assets/productimages',
      filename,
      url: publicUrl,
      assetPath: `assets/productimages/${filename}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process image upload',
      error: error.message,
    });
  }
});

/**
 * POST /api/upload/base64
 * Support base64 image data upload
 */
router.post('/base64', (req, res) => {
  try {
    const { base64Data, filename: rawName, type } = req.body;
    const isHero = type === 'hero' || req.query.type === 'hero';

    if (!base64Data) {
      return res.status(400).json({ success: false, message: 'base64Data is required' });
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let ext = '.png';
    let buffer;

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
      else if (mime.includes('webp')) ext = '.webp';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    const cleanBaseName = (rawName || (isHero ? 'hero_bg' : 'fragrance'))
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_');
    const prefix = isHero ? 'hero_bg' : 'prod';
    const filename = `${prefix}_${Date.now()}_${cleanBaseName}${ext}`;

    if (isHero) {
      const assetFilePath = path.join(assetsHeroImagesDir, filename);
      const publicFilePath = path.join(publicHeroImagesDir, filename);
      const backendFilePath = path.join(backendHeroUploadsDir, filename);

      fs.writeFileSync(assetFilePath, buffer);
      fs.writeFileSync(publicFilePath, buffer);
      try {
        fs.writeFileSync(backendFilePath, buffer);
      } catch {}

      const publicUrl = `/hero_bg_imgaes/${filename}`;
      return res.json({
        success: true,
        message: 'Background image successfully stored in assets/hero_bg_imgaes',
        filename,
        url: publicUrl,
        assetPath: `assets/hero_bg_imgaes/${filename}`,
      });
    }

    const assetFilePath = path.join(assetsProductimagesDir, filename);
    const publicFilePath = path.join(publicProductimagesDir, filename);
    const backendFilePath = path.join(backendUploadsDir, filename);

    fs.writeFileSync(assetFilePath, buffer);
    fs.writeFileSync(publicFilePath, buffer);
    try {
      fs.writeFileSync(backendFilePath, buffer);
    } catch {}

    const publicUrl = `/productimages/${filename}`;

    res.json({
      success: true,
      message: 'Product image successfully stored in assets/productimages',
      filename,
      url: publicUrl,
      assetPath: `assets/productimages/${filename}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to write base64 image',
      error: error.message,
    });
  }
});

export default router;
