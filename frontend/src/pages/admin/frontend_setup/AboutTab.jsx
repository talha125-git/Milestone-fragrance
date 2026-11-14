import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Save,
  RotateCcw,
  Check,
  Image as ImageIcon,
  BookOpen,
  User,
  Quote,
  Compass,
  Award,
  Globe,
  ExternalLink,
  Eye,
  AlertCircle,
} from 'lucide-react';
import {
  DEFAULT_ABOUT_DATA,
  loadStoredAbout,
  fetchAboutFromServer,
  saveAboutToServer,
} from '../../../data/about';

export default function AboutTab({ showToast }) {
  const [formData, setFormData] = useState(loadStoredAbout);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingSec1, setIsUploadingSec1] = useState(false);
  const [isUploadingSec2, setIsUploadingSec2] = useState(false);
  const [activeSectionView, setActiveSectionView] = useState('section1');

  useEffect(() => {
    fetchAboutFromServer().then((latest) => {
      if (latest) setFormData(latest);
    });
  }, []);

  // Update Section 1 fields
  const updateSection1 = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      section1: {
        ...prev.section1,
        [field]: value,
      },
    }));
  };

  // Update Section 1 Paragraphs array
  const handleParagraphChangeSec1 = (index, value) => {
    const current = [...(formData.section1?.paragraphs || [])];
    current[index] = value;
    updateSection1('paragraphs', current);
  };

  // Update Section 2 fields
  const updateSection2 = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      section2: {
        ...prev.section2,
        [field]: value,
      },
    }));
  };

  // Update Section 2 Paragraphs array
  const handleParagraphChangeSec2 = (index, value) => {
    const current = [...(formData.section2?.paragraphs || [])];
    current[index] = value;
    updateSection2('paragraphs', current);
  };

  // Upload Image 1 (Brand Story Showcase)
  const handleImage1Upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSec1(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      uploadData.append('type', 'product');

      const res = await fetch('/api/upload?type=product', {
        method: 'POST',
        body: uploadData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          updateSection1('image', json.url);
          if (showToast) showToast('Story image uploaded successfully!');
        }
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          updateSection1('image', ev.target.result);
          if (showToast) showToast('Story image updated!');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Image 1 upload fallback:', err);
    } finally {
      setIsUploadingSec1(false);
    }
  };

  // Upload Image 2 (Founder Portrait)
  const handleImage2Upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSec2(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      uploadData.append('type', 'product');

      const res = await fetch('/api/upload?type=product', {
        method: 'POST',
        body: uploadData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          updateSection2('image', json.url);
          if (showToast) showToast('Founder portrait uploaded successfully!');
        }
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          updateSection2('image', ev.target.result);
          if (showToast) showToast('Founder portrait updated!');
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Image 2 upload fallback:', err);
    } finally {
      setIsUploadingSec2(false);
    }
  };

  // Save changes
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await saveAboutToServer(formData);
      if (res.success) {
        setSaveSuccess(true);
        if (showToast) showToast('About Us story updated and published to storefront!');
        setTimeout(() => setSaveSuccess(false), 2800);
      }
    } catch (err) {
      if (showToast) showToast('Failed to save: ' + err.message, 'info');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (window.confirm('Reset all About Us story content and images to defaults?')) {
      setFormData(DEFAULT_ABOUT_DATA);
      saveAboutToServer(DEFAULT_ABOUT_DATA);
      if (showToast) showToast('About Us content reset to default', 'info');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 text-stone-900 font-serif font-bold text-lg sm:text-xl">
            <BookOpen className="w-5 h-5 text-[#b38531]" />
            <span>Frontend Setup: About Us Story & Leadership</span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Control the brand narrative, company journey, vision pillars, and CEO/Founder profile with live storefront synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-stone-400" />
            <span>View Live Page</span>
          </a>

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
                <Check className="w-4 h-4 text-emerald-950" />
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

      {/* Navigation Tabs for Section 1 vs Section 2 */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveSectionView('section1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSectionView === 'section1'
              ? 'bg-[#14120f] text-[#dfb76c] shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Part 1: The Art of Fragrance & Journey</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSectionView('section2')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSectionView === 'section2'
              ? 'bg-[#14120f] text-[#dfb76c] shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Part 2: Yaseen Ahmad — CEO & Founder</span>
        </button>
      </div>

      {/* ========================================================
          PART 1: THE ART OF FRAGRANCE, THE SPIRIT OF MILESTONE
         ======================================================== */}
      {activeSectionView === 'section1' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Fields (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#b38531] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Story Headlines & Narrative Paragraphs
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Displayed prominently at the top of the About Us page.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Eyebrow Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.section1?.eyebrow || ''}
                    onChange={(e) => updateSection1('eyebrow', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Main Story Title
                  </label>
                  <input
                    type="text"
                    value={formData.section1?.title || ''}
                    onChange={(e) => updateSection1('title', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                  />
                </div>

                {/* 5 Narrative Paragraphs */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    Narrative Paragraphs (5 Paragraphs)
                  </label>
                  {(formData.section1?.paragraphs || []).map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">
                        Paragraph {idx + 1}
                      </span>
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => handleParagraphChangeSec1(idx, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20 resize-y"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vision, Commitment & More Than Fragrance Cards */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#b38531] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Core Pillars & Brand Manifesto
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Vision, Commitment, and Group of Companies backing.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Vision */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#b38531]" />
                    <span>OUR VISION</span>
                  </span>
                  <textarea
                    rows={2}
                    value={formData.section1?.vision?.text || ''}
                    onChange={(e) =>
                      updateSection1('vision', {
                        ...formData.section1?.vision,
                        text: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c]"
                  />
                </div>

                {/* Commitment */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#b38531]" />
                    <span>OUR COMMITMENT</span>
                  </span>
                  <textarea
                    rows={2}
                    value={formData.section1?.commitment?.text || ''}
                    onChange={(e) =>
                      updateSection1('commitment', {
                        ...formData.section1?.commitment,
                        text: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c]"
                  />
                </div>

                {/* More than fragrance */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#b38531]" />
                    <span>MORE THAN A FRAGRANCE</span>
                  </span>
                  <textarea
                    rows={2}
                    value={formData.section1?.moreThanFragrance?.text || ''}
                    onChange={(e) =>
                      updateSection1('moreThanFragrance', {
                        ...formData.section1?.moreThanFragrance,
                        text: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c]"
                  />
                </div>

                {/* Tagline Ribbon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Brand Name Ribbon
                    </label>
                    <input
                      type="text"
                      value={formData.section1?.taglineBrand || ''}
                      onChange={(e) => updateSection1('taglineBrand', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Brand Slogan
                    </label>
                    <input
                      type="text"
                      value={formData.section1?.taglineSlogan || ''}
                      onChange={(e) => updateSection1('taglineSlogan', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-stone-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image & Preview Side (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#b38531] flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Story Image 1 (Atelier & Collection)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Paired with Part 1 of the story.
                  </p>
                </div>
              </div>

              {/* Image Preview Box */}
              <div className="relative aspect-square w-full rounded-xl bg-[#14120f] border border-[#2b241c] p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={formData.section1?.image}
                  alt="Story Preview"
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>

              {/* Image Upload Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Replace Image (Upload File)
                </label>
                <label className="w-full py-2.5 px-4 rounded-xl border border-dashed border-stone-300 hover:border-[#dfb76c] bg-stone-50 hover:bg-amber-50/50 text-stone-600 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-stone-500" />
                  <span>{isUploadingSec1 ? 'Uploading...' : 'Choose Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage1Upload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Or Image URL
                </label>
                <input
                  type="text"
                  value={formData.section1?.image || ''}
                  onChange={(e) => updateSection1('image', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PART 2: YASEEN AHMAD — CEO & FOUNDER
         ======================================================== */}
      {activeSectionView === 'section2' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Fields (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#b38531] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Founder Information & Bio
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Executive introduction, perfumer collaborations, and vision.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Founder Name *
                    </label>
                    <input
                      type="text"
                      value={formData.section2?.founderName || ''}
                      onChange={(e) => updateSection2('founderName', e.target.value)}
                      placeholder="YASEEN AHMAD"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Role / Title *
                    </label>
                    <input
                      type="text"
                      value={formData.section2?.founderRole || ''}
                      onChange={(e) => updateSection2('founderRole', e.target.value)}
                      placeholder="CEO & FOUNDER"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Parent Organization
                  </label>
                  <input
                    type="text"
                    value={formData.section2?.company || ''}
                    onChange={(e) => updateSection2('company', e.target.value)}
                    placeholder="Milestone Group of Companies"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20"
                  />
                </div>

                {/* 3 Founder Bio Paragraphs */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    Leadership Narrative (3 Paragraphs)
                  </label>
                  {(formData.section2?.paragraphs || []).map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">
                        Paragraph {idx + 1}
                      </span>
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => handleParagraphChangeSec2(idx, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20 resize-y"
                      />
                    </div>
                  ))}
                </div>

                {/* Founder Quote */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Signature Founder Quote
                  </label>
                  <div className="relative">
                    <Quote className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <textarea
                      rows={2}
                      value={formData.section2?.quote || ''}
                      onChange={(e) => updateSection2('quote', e.target.value)}
                      placeholder="Great brands are not built by following milestones, but by creating them."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-[#dfb76c] focus:ring-2 focus:ring-[#dfb76c]/20 resize-none font-serif italic"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image & Preview Side (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#b38531] flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Founder Portrait Image (Yaseen Ahmad)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Official executive portrait shown in Section 2.
                  </p>
                </div>
              </div>

              {/* Portrait Preview Box */}
              <div className="relative aspect-[4/5] w-full rounded-xl bg-[#0a0908] border border-[#2b241c] overflow-hidden shadow-md">
                <img
                  src={formData.section2?.image}
                  alt={formData.section2?.founderName}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#dfb76c] block">
                    {formData.section2?.founderRole || 'CEO & FOUNDER'}
                  </span>
                  <span className="text-sm font-bold text-white font-serif">
                    {formData.section2?.founderName || 'Yaseen Ahmad'}
                  </span>
                </div>
              </div>

              {/* Image Upload Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Replace Portrait (Upload Image)
                </label>
                <label className="w-full py-2.5 px-4 rounded-xl border border-dashed border-stone-300 hover:border-[#dfb76c] bg-stone-50 hover:bg-amber-50/50 text-stone-600 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-stone-500" />
                  <span>{isUploadingSec2 ? 'Uploading...' : 'Choose Portrait File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage2Upload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Or Image URL
                </label>
                <input
                  type="text"
                  value={formData.section2?.image || ''}
                  onChange={(e) => updateSection2('image', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

