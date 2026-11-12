import { ghanamHeroBg, believeHeroBg, heroBg, professorHeroBg } from '../assets';

export const heroImagePresets = {
  ghanamHeroBg: { label: 'Ghanam Royal Desert', image: ghanamHeroBg },
  believeHeroBg: { label: 'Believe Mediterranean Sea', image: believeHeroBg },
  heroBg: { label: 'Signature Golden Noir', image: heroBg },
  professorHeroBg: { label: 'Professor Classic Study', image: professorHeroBg },
};

export const defaultHeroSlides = [
  {
    id: 'ghanam',
    bgKey: 'ghanamHeroBg',
    bgImage: ghanamHeroBg,
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
    bgImage: believeHeroBg,
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
    bgImage: heroBg,
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
    bgImage: professorHeroBg,
    tag: 'PROFESSOR EDITION • BOLD & SOPHISTICATED',
    titleLine1: 'Professor Edition',
    titleLine2: 'A Scent That Defines Character',
    description: 'Bold, intelligent and sophisticated. Professor blends rich woody notes with black cardamom, smoked leather, and Madagascar amber for a magnetic impression.',
    notes: 'Black Cardamom, Smoked Leather & Amber',
    product: 'Professor Edition',
    price: 'Rs. 6,499',
  },
];

/**
 * Hydrates stored slides JSON into runtime slides with proper asset references
 */
export function hydrateHeroSlides(rawSlides) {
  if (!Array.isArray(rawSlides) || rawSlides.length === 0) {
    return defaultHeroSlides;
  }

  return rawSlides.map((slide) => {
    let resolvedBg = slide.bgImage;

    // If slide has a custom uploaded path or base64
    if (slide.bgImage && (
      slide.bgImage.startsWith('/hero_bg_imgaes') ||
      slide.bgImage.startsWith('/productimages') ||
      slide.bgImage.startsWith('data:') ||
      slide.bgImage.startsWith('http')
    )) {
      resolvedBg = slide.bgImage;
    } else if (slide.bgKey && heroImagePresets[slide.bgKey]) {
      resolvedBg = heroImagePresets[slide.bgKey].image;
    } else if (slide.bgImage && heroImagePresets[slide.bgImage]) {
      resolvedBg = heroImagePresets[slide.bgImage].image;
    }

    // Default fallback if empty
    if (!resolvedBg) {
      const defaultMatch = defaultHeroSlides.find((ds) => ds.id === slide.id);
      resolvedBg = defaultMatch ? defaultMatch.bgImage : heroBg;
    }

    return {
      ...slide,
      bgImage: resolvedBg,
    };
  });
}

