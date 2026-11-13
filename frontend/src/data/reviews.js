export const defaultReviews = [];

// Set of dummy review IDs to purge from any existing client localStorage
const dummyReviewIds = new Set([
  'rev-1',
  'rev-2',
  'rev-3',
  'rev-4',
  'rev-5',
  'rev-6',
  'rev-7',
  'rev-8',
]);

export const loadStoredReviews = () => {
  try {
    const raw = localStorage.getItem('milestone_reviews');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out dummy reviews & test reviews
        const cleaned = parsed.filter(
          (r) =>
            !dummyReviewIds.has(r.id) &&
            r.comment !== 'abc' &&
            r.title !== 'bad' &&
            r.name !== 'test'
        );
        // Resave cleaned list back to localStorage
        localStorage.setItem('milestone_reviews', JSON.stringify(cleaned));
        return cleaned;
      }
    }
  } catch (err) {
    console.warn('Error reading stored reviews:', err);
  }
  return [];
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
