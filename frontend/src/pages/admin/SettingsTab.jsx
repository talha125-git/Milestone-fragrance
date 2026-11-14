import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Save,
  RotateCcw,
  ExternalLink,
  Check,
  Sparkles,
  Globe,
  Share2,
  Building,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  DEFAULT_SETTINGS,
  loadStoredSettings,
  saveSettingsToServer,
  fetchSettingsFromServer,
} from '../../data/settings';

export default function SettingsTab({ showToast }) {
  const [formData, setFormData] = useState(loadStoredSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch fresh settings on mount
  useEffect(() => {
    fetchSettingsFromServer().then((latest) => {
      if (latest) setFormData(latest);
    });
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');

    try {
      const res = await saveSettingsToServer(formData);
      if (res.success) {
        setSaveSuccess(true);
        if (showToast) {
          showToast('Store settings & footer links updated successfully!');
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setErrorMsg('Failed to save settings to server. Stored locally.');
      }
    } catch (err) {
      setErrorMsg('Failed to save settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setFormData(DEFAULT_SETTINGS);
      saveSettingsToServer(DEFAULT_SETTINGS);
      if (showToast) {
        showToast('Settings reset to defaults', 'info');
      }
    }
  };

  const socialConfig = [
    {
      key: 'facebook',
      label: 'Facebook Page URL',
      placeholder: 'https://facebook.com/yourbrand',
      iconSvg: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
      badgeColor: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
      accentColor: '#1877F2',
    },
    {
      key: 'instagram',
      label: 'Instagram Profile URL',
      placeholder: 'https://instagram.com/yourbrand',
      iconSvg: 'M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zm-4 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.5-7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z',
      badgeColor: 'bg-pink-600/10 text-pink-400 border-pink-500/20',
      accentColor: '#E1306C',
    },
    {
      key: 'tiktok',
      label: 'TikTok Profile URL',
      placeholder: 'https://tiktok.com/@yourbrand',
      iconSvg: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.32V9.45a8.16 8.16 0 0 0 4.91 1.63V7.64a4.85 4.85 0 0 1-1-.95z',
      badgeColor: 'bg-stone-800 text-stone-200 border-stone-700',
      accentColor: '#00f2fe',
    },
    {
      key: 'youtube',
      label: 'YouTube Channel URL',
      placeholder: 'https://youtube.com/@yourbrand',
      iconSvg: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
      badgeColor: 'bg-red-600/10 text-red-400 border-red-500/20',
      accentColor: '#FF0000',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-lg sm:text-xl">
            <Globe className="w-5 h-5 text-[#b38531]" />
            <span>Storefront Settings & Footer Control</span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Configure your brand location, customer service contacts, and the 4 official social media links (Facebook, Instagram, TikTok, YouTube) displayed in the storefront footer.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#dfb76c] hover:bg-[#caa055] text-[#0d0c0a] font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#dfb76c]/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-900" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid: Settings Inputs + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Store Location & Contacts */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#b38531] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Store Location & Contact Coordinates
                </h3>
                <p className="text-[11px] text-stone-500">
                  Shown in the "Contact Us" column of the storefront footer.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Footer Location Name (City / Region) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g. Lahore, Pakistan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                  />
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  Appears directly next to the location pin in the footer.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Atelier / Flagship Address
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="e.g. Milestone Fragrance Atelier, MM Alam Road, Gulberg III, Lahore, Pakistan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Official Support Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="info@milestonefragrances.pk"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Customer Care Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Social Media Links */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#b38531] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Social Media Channels (Footer Icons)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Control destination URLs for the 4 footer icons: Facebook, Instagram, TikTok, YouTube.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                4 Active Icons
              </span>
            </div>

            <div className="space-y-4">
              {socialConfig.map((soc) => {
                const currentVal = formData?.socialLinks?.[soc.key] || '';
                return (
                  <div key={soc.key} className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#14120f] text-[#dfb76c] flex items-center justify-center">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d={soc.iconSvg} />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-stone-800">{soc.label}</span>
                      </div>

                      {currentVal && (
                        <a
                          href={currentVal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-medium text-[#b38531] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Test Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <input
                      type="url"
                      value={currentVal}
                      onChange={(e) => handleSocialChange(soc.key, e.target.value)}
                      placeholder={soc.placeholder}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Storefront Footer Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 bg-[#0a0908] rounded-2xl border border-[#262019] p-6 text-stone-300 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#201b16]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#dfb76c]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white font-serif">
                  Live Footer Preview
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] font-semibold border border-[#dfb76c]/30">
                Real-Time
              </span>
            </div>

            {/* Simulated Footer Column 1: Social Icons */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Brand Social Icons (4 Networks)
              </span>
              <p className="text-xs text-stone-400 font-light">
                Click any icon below to test destination page navigation:
              </p>

              <div className="flex items-center gap-3 pt-1">
                {socialConfig.map((soc) => {
                  const url = formData?.socialLinks?.[soc.key];
                  return (
                    <a
                      key={soc.key}
                      href={url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${soc.label}: ${url || 'No URL configured'}`}
                      className="w-9 h-9 rounded-full border border-stone-800 hover:border-[#dfb76c] bg-[#14120f] hover:bg-[#dfb76c] text-stone-400 hover:text-[#0d0c0a] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d={soc.iconSvg} />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Simulated Footer Column 4: Contact Us */}
            <div className="pt-4 border-t border-[#201b16] space-y-3">
              <h4 className="text-white text-xs font-semibold tracking-wider uppercase text-[#dfb76c]">
                Contact Us Preview
              </h4>
              <div className="space-y-2.5 text-xs text-stone-400">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                  <span className="text-stone-300 font-medium">
                    {formData.email || 'info@milestonefragrances.pk'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                  <span className="text-stone-300 font-medium">
                    {formData.phone || '+92 300 1234567'}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0 mt-0.5" />
                  <span className="text-stone-300 font-medium">
                    {formData.location || 'Lahore, Pakistan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="pt-4 border-t border-[#201b16] flex items-start gap-2.5 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-[#dfb76c] flex-shrink-0 mt-0.5" />
              <span>
                All social media links open securely in a new browser tab with <code className="text-[#dfb76c]">rel="noopener noreferrer"</code>.
              </span>
            </div>

            {/* Save Button Inside Preview */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-[#dfb76c] hover:bg-[#caa055] text-[#0d0c0a] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish to Live Storefront</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

