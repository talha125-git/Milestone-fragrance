export const DEFAULT_ABOUT_DATA = {
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

export const ABOUT_STORAGE_KEY = 'milestone_about_data';
export const ABOUT_UPDATED_EVENT = 'milestone_about_updated';

/**
 * Load about data from localStorage with fallback to defaults
 */
export const loadStoredAbout = () => {
  try {
    const raw = localStorage.getItem(ABOUT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        section1: {
          ...DEFAULT_ABOUT_DATA.section1,
          ...(parsed.section1 || {}),
        },
        section2: {
          ...DEFAULT_ABOUT_DATA.section2,
          ...(parsed.section2 || {}),
        },
      };
    }
  } catch (e) {
    console.warn('[About] Failed to load localStorage about data:', e);
  }
  return DEFAULT_ABOUT_DATA;
};

/**
 * Persist about data in localStorage and dispatch reactive event
 */
export const persistAbout = (aboutData) => {
  try {
    localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(aboutData));
    window.dispatchEvent(new CustomEvent(ABOUT_UPDATED_EVENT, { detail: aboutData }));
  } catch (e) {
    console.warn('[About] Failed to persist about data locally:', e);
  }
};

/**
 * Fetch fresh about data from Express backend API
 */
export const fetchAboutFromServer = async () => {
  try {
    const res = await fetch('/api/about');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const merged = {
          section1: {
            ...DEFAULT_ABOUT_DATA.section1,
            ...(json.data.section1 || {}),
          },
          section2: {
            ...DEFAULT_ABOUT_DATA.section2,
            ...(json.data.section2 || {}),
          },
        };
        persistAbout(merged);
        return merged;
      }
    }
  } catch (e) {
    // Offline fallback
  }
  return loadStoredAbout();
};

/**
 * Save about data to backend and update localStorage
 */
export const saveAboutToServer = async (newData) => {
  persistAbout(newData);
  try {
    const res = await fetch('/api/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        persistAbout(json.data);
        return { success: true, data: json.data };
      }
    }
  } catch (err) {
    console.warn('[About] Failed to save about data to server:', err);
  }
  return { success: true, data: newData };
};

