import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Destination folders
const assetsProductimagesDir = path.resolve(__dirname, '../../frontend/src/assets/productimages');
const publicProductimagesDir = path.resolve(__dirname, '../../frontend/public/productimages');
const backendUploadsDir = path.resolve(__dirname, '../public/productimages');

// Ensure all target directories exist
[assetsProductimagesDir, publicProductimagesDir, backendUploadsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, assetsProductimagesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_');
    const uniqueName = `prod_${Date.now()}_${baseName}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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
 */
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file was uploaded',
      });
    }

    const filename = req.file.filename;
    const sourcePath = req.file.path; // already in assets/productimages

    // Also copy to frontend/public/productimages so Vite can serve it immediately at /productimages/<filename>
    const publicDest = path.join(publicProductimagesDir, filename);
    const backendDest = path.join(backendUploadsDir, filename);

    try {
      fs.copyFileSync(sourcePath, publicDest);
      fs.copyFileSync(sourcePath, backendDest);
    } catch (copyErr) {
      console.warn('[Upload] Notice while syncing to public dirs:', copyErr.message);
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
    const { base64Data, filename: rawName } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, message: 'base64Data is required' });
    }

    // Extract base64 payload & mime extension
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

    const cleanBaseName = (rawName || 'fragrance')
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_');
    const filename = `prod_${Date.now()}_${cleanBaseName}${ext}`;

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

