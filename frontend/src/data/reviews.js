export const defaultReviews = [
  {
    id: 'rev-1',
    productId: 'signature',
    productName: 'Signature art. 023',
    name: 'Muhammad Usman',
    city: 'Lahore',
    rating: 5,
    title: 'A true French-standard masterpiece!',
    comment: 'The smoky cedarwood, golden ambergris and bergamot blend effortlessly on skin. Lasted over 14 hours during a formal wedding event without fading. Definitely my signature scent now.',
    performance: '12+ Hours Longevity',
    verified: true,
    helpful: 18,
    date: 'Nov 10, 2026',
    createdAt: '2026-11-10T12:00:00.000Z',
  },
  {
    id: 'rev-2',
    productId: 'signature',
    productName: 'Signature art. 023',
    name: 'Dr. Zainab Tariq',
    city: 'Karachi',
    rating: 5,
    title: 'Magnetic, non-synthetic & compliments all day',
    comment: 'I bought this after smelling it on my colleague. It envelops you in warm amber and cedar with zero synthetic harshness. Received so many compliments at the clinic.',
    performance: 'Huge Compliment Magnet',
    verified: true,
    helpful: 12,
    date: 'Nov 08, 2026',
    createdAt: '2026-11-08T15:30:00.000Z',
  },
  {
    id: 'rev-3',
    productId: 'believe',
    productName: 'Believe',
    name: 'Ayesha Malik',
    city: 'Lahore',
    rating: 5,
    title: 'Invigorating, clean and uplifting fresh notes',
    comment: 'Believe is an extraordinary daytime scent. The grapefruit zest and marine notes stay sharp and crisp throughout humid weather. Easily the best fresh fragrance in my vanity.',
    performance: 'Fresh Daytime Perfection',
    verified: true,
    helpful: 15,
    date: 'Nov 07, 2026',
    createdAt: '2026-11-07T09:20:00.000Z',
  },
  {
    id: 'rev-4',
    productId: 'ghanam',
    productName: 'Ghanam رنگ',
    name: 'Saad Al-Ghamdi',
    city: 'Peshawar',
    rating: 5,
    title: 'Regal Arab luxury in a bottle',
    comment: 'Drawing inspiration from royal Arab traditions, the Persian saffron and Cambodian agarwood create a velvety, hypnotic aura. The concentration is pure luxury.',
    performance: 'Royal Sillage',
    verified: true,
    helpful: 21,
    date: 'Nov 05, 2026',
    createdAt: '2026-11-05T18:10:00.000Z',
  },
  {
    id: 'rev-5',
    productId: 'professor',
    productName: 'Professor',
    name: 'Omer Farooq',
    city: 'Islamabad',
    rating: 5,
    title: 'Bold, intelligent & commands the room',
    comment: 'The black cardamom and smoked leather notes create a profound impression. Designed for those who want to command presence without shouting. Exceptional longevity.',
    performance: 'Strong Projection',
    verified: true,
    helpful: 14,
    date: 'Nov 04, 2026',
    createdAt: '2026-11-04T11:45:00.000Z',
  },
  {
    id: 'rev-6',
    productId: 'believe',
    productName: 'Believe',
    name: 'Hamza Khan',
    city: 'Karachi',
    rating: 5,
    title: 'Long-lasting summer breeze',
    comment: 'Most fresh fragrances vanish in 3 hours, but Believe easily lasts 8+ hours on my shirt. The ambergris and cedar base gives it remarkable staying power.',
    performance: '8+ Hours Longevity',
    verified: true,
    helpful: 9,
    date: 'Nov 03, 2026',
    createdAt: '2026-11-03T14:15:00.000Z',
  },
  {
    id: 'rev-7',
    productId: 'ghanam',
    productName: 'Ghanam رنگ',
    name: 'Bilal Ahmed Khan',
    city: 'Rawalpindi',
    rating: 5,
    title: 'Warm damask rose and agarwood perfection',
    comment: 'A true connoisseur creation. The rose and patchouli notes are so deeply compounded. Lasts for days on my jackets.',
    performance: '14+ Hours Longevity',
    verified: true,
    helpful: 11,
    date: 'Nov 02, 2026',
    createdAt: '2026-11-02T10:00:00.000Z',
  },
  {
    id: 'rev-8',
    productId: 'professor',
    productName: 'Professor',
    name: 'Daniyal Tariq',
    city: 'Multan',
    rating: 5,
    title: 'Distinctive and commanding drydown',
    comment: 'Tonka bean and smoked leather done right. It gives off serious executive elegance. Very satisfied with the projection.',
    performance: 'Bold Executive Presence',
    verified: true,
    helpful: 8,
    date: 'Nov 01, 2026',
    createdAt: '2026-11-01T16:20:00.000Z',
  },
];

export const loadStoredReviews = () => {
  try {
    const raw = localStorage.getItem('milestone_reviews');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with defaults so new defaults aren't missed
        const existingIds = new Set(parsed.map((r) => r.id));
        const missingDefaults = defaultReviews.filter((dr) => !existingIds.has(dr.id));
        return [...parsed, ...missingDefaults];
      }
    }
  } catch (err) {
    console.warn('Error reading stored reviews:', err);
  }
  return defaultReviews;
};

export const persistReviews = (reviewsList) => {
  try {
    localStorage.setItem('milestone_reviews', JSON.stringify(reviewsList));
    // Broadcast storage event for other components in same window
    window.dispatchEvent(new Event('milestone_reviews_updated'));
  } catch (err) {
    console.warn('Error persisting reviews:', err);
  }
};

