import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const settingsFilePath = path.resolve(__dirname, '../data/settings.json');

const defaultSettings = {
  location: 'Lahore, Pakistan',
  address: 'Milestone Fragrance Atelier, Lahore, Pakistan',
  email: 'info@milestonefragrances.pk',
  phone: '+92 300 1234567',
  socialLinks: {
    facebook: 'https://facebook.com/milestonefragrances',
    instagram: 'https://instagram.com/milestonefragrances',
    tiktok: 'https://tiktok.com/@milestonefragrances',
    youtube: 'https://youtube.com/@milestonefragrances',
  },
};

// Helper to read settings
const getSettings = () => {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn('[Settings] Failed to read settings.json, returning default:', err.message);
  }
  return defaultSettings;
};

// Helper to save settings
const saveSettings = (newSettings) => {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(newSettings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Settings] Failed to write settings.json:', err.message);
    return false;
  }
};

/**
 * GET /api/settings
 * Retrieve store location, contact details & social media links
 */
router.get('/', (req, res) => {
  const current = getSettings();
  res.json({
    success: true,
    data: current,
  });
});

/**
 * POST /api/settings
 * Update store settings (Admin)
 */
router.post('/', (req, res) => {
  try {
    const current = getSettings();
    const { location, address, email, phone, socialLinks } = req.body;

    const updated = {
      ...current,
      location: location !== undefined ? String(location).trim() : current.location,
      address: address !== undefined ? String(address).trim() : current.address,
      email: email !== undefined ? String(email).trim() : current.email,
      phone: phone !== undefined ? String(phone).trim() : current.phone,
      socialLinks: {
        ...current.socialLinks,
        ...(socialLinks && typeof socialLinks === 'object' ? socialLinks : {}),
      },
    };

    saveSettings(updated);

    res.json({
      success: true,
      message: 'Store settings updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to save settings',
      error: err.message,
    });
  }
});

export default router;

