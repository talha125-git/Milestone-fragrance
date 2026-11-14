export const DEFAULT_SETTINGS = {
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

export const SETTINGS_STORAGE_KEY = 'milestone_store_settings';
export const SETTINGS_UPDATED_EVENT = 'milestone_settings_updated';

/**
 * Load settings from localStorage with fallback to DEFAULT_SETTINGS
 */
export const loadStoredSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        socialLinks: {
          ...DEFAULT_SETTINGS.socialLinks,
          ...(parsed.socialLinks || {}),
        },
      };
    }
  } catch (e) {
    console.warn('[Settings] Failed to load localStorage settings:', e);
  }
  return DEFAULT_SETTINGS;
};

/**
 * Persist settings locally and dispatch real-time custom event
 */
export const persistSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT, { detail: settings }));
  } catch (e) {
    console.warn('[Settings] Failed to save localStorage settings:', e);
  }
};

/**
 * Fetch settings from Express backend API with fallback
 */
export const fetchSettingsFromServer = async () => {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const merged = {
          ...DEFAULT_SETTINGS,
          ...json.data,
          socialLinks: {
            ...DEFAULT_SETTINGS.socialLinks,
            ...(json.data.socialLinks || {}),
          },
        };
        persistSettings(merged);
        return merged;
      }
    }
  } catch (e) {
    // Offline or server down fallback
  }
  return loadStoredSettings();
};

/**
 * Save settings to backend and local storage
 */
export const saveSettingsToServer = async (newSettings) => {
  persistSettings(newSettings);
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        persistSettings(json.data);
        return { success: true, data: json.data };
      }
    }
  } catch (err) {
    console.warn('[Settings] Failed to sync to server:', err);
  }
  return { success: true, data: newSettings };
};

