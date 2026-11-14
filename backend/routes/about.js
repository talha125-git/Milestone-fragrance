import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const aboutFilePath = path.resolve(__dirname, '../data/about.json');

const defaultAboutData = {
  section1: {
    eyebrow: "THE ART OF FRAGRANCE, THE SPIRIT OF MILESTONE",
    title: "A New Chapter in Our Journey",
    paragraphs: [
      "Milestone Fragrance is a proud addition to the Milestone Group of Companies, bringing our passion for quality, innovation, and excellence into the world of fragrances.",
      "Built on a foundation of business experience, product development, and manufacturing, our journey has always been driven by one ambition: to create products that inspire confidence and make a lasting impression.",
      "Today, we are excited to take another step forward by introducing our fragrance collection. We believe that a fragrance is more than just a scent; it is a reflection of personality, an expression of individuality, and a memory that stays long after the moment has passed.",
      "At Milestone Fragrance, we bring together creativity, attention to detail, and a commitment to quality to create fragrances for those who appreciate elegance, character, and distinction.",
      "Our journey continues, and every fragrance tells a new story."
    ],
    image: "/assets/our_story.png",
    imageAlt: "Milestone Fragrance Collection",
    vision: {
      title: "OUR VISION",
      text: "To establish Milestone Fragrance as a trusted name in the fragrance industry by delivering exceptional fragrance experiences, maintaining high standards of quality, and continuously exploring new possibilities through innovation."
    },
    commitment: {
      title: "OUR COMMITMENT",
      text: "Quality is not just a promise; it is the foundation of everything we do. From product development and manufacturing to the final experience, we believe every detail matters. Our goal is to bring confidence, elegance, and value to every customer."
    },
    moreThanFragrance: {
      title: "MORE THAN A FRAGRANCE",
      text: "We are part of a bigger vision. Backed by the spirit of Milestone Group of Companies, Milestone Fragrance represents our commitment to growth, innovation, and building brands that stand the test of time."
    },
    taglineBrand: "MILESTONE FRAGRANCE",
    taglineSlogan: "Wear Your Identity. Leave Your Impression."
  },
  section2: {
    eyebrow: "LEADERSHIP & VISION",
    founderName: "YASEEN AHMAD",
    founderRole: "CEO & FOUNDER",
    company: "Milestone Group of Companies",
    paragraphs: [
      "As the visionary leader behind Milestone Group of Companies, Yaseen Ahmad represents a commitment to ambition, innovation, and building brands with purpose. His entrepreneurial vision drives the company's expansion into new industries, with Milestone Fragrance marking an exciting new chapter in its journey.",
      "Believing that excellence comes from bringing the right talent and expertise together, Yaseen is dedicated to collaborating with highly skilled fragrance specialists and master perfumers from around the world. His vision is to unite world-class perfumery expertise, creativity, and quality under one brand, delivering distinctive fragrance experiences to customers.",
      "For him, Milestone Fragrance is more than a business venture; it is an opportunity to build something meaningful, create lasting value, and establish a brand that inspires confidence and leaves a remarkable impression."
    ],
    quote: "Great brands are not built by following milestones, but by creating them.",
    image: "/assets/founder_yaseen_ahmad.png",
    imageAlt: "Yaseen Ahmad, CEO & Founder"
  }
};

const getAboutData = () => {
  try {
    if (fs.existsSync(aboutFilePath)) {
      const data = fs.readFileSync(aboutFilePath, 'utf-8');
      return { ...defaultAboutData, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn('[About] Failed to read about.json:', err.message);
  }
  return defaultAboutData;
};

const saveAboutData = (newData) => {
  try {
    fs.writeFileSync(aboutFilePath, JSON.stringify(newData, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[About] Failed to save about.json:', err.message);
    return false;
  }
};

/**
 * GET /api/about
 */
router.get('/', (req, res) => {
  const data = getAboutData();
  res.json({
    success: true,
    data,
  });
});

/**
 * POST /api/about
 */
router.post('/', (req, res) => {
  try {
    const current = getAboutData();
    const { section1, section2 } = req.body;

    const updated = {
      section1: {
        ...current.section1,
        ...(section1 || {}),
      },
      section2: {
        ...current.section2,
        ...(section2 || {}),
      },
    };

    saveAboutData(updated);

    res.json({
      success: true,
      message: 'About page content updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to save about data',
      error: err.message,
    });
  }
});

export default router;

