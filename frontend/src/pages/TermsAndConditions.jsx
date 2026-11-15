import React, { useEffect, useState } from 'react';
import {
  FileText,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  Award,
} from 'lucide-react';
import PolicyNavTabs from '../components/PolicyNavTabs';
import { loadStoredSettings, fetchSettingsFromServer, SETTINGS_UPDATED_EVENT } from '../data/settings';

export default function TermsAndConditions() {
  const [settings, setSettings] = useState(loadStoredSettings);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSettingsFromServer().then((data) => {
      if (data) setSettings(data);
    });

    const handleUpdate = (e) => {
      setSettings(e.detail || loadStoredSettings());
    };
    window.addEventListener(SETTINGS_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, handleUpdate);
  }, []);

  const contactEmail = settings?.email || 'info@milestonefragrances.pk';
  const contactPhone = settings?.phone || '+92 300 1234567';
  const contactAddress = settings?.address || settings?.location || 'Milestone Fragrance Atelier, Lahore, Pakistan';

  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 py-12 sm:py-20 font-sans selection:bg-[#dfb76c] selection:text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <PolicyNavTabs activePolicy="terms" />

        {/* Hero Title Header */}
        <header className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dfb76c]/10 border border-[#dfb76c]/30 text-[#dfb76c] text-xs font-semibold uppercase tracking-[0.2em]">
            <Scale className="w-3.5 h-3.5" />
            <span>Store Terms & Service Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
            Terms & Conditions
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            Welcome to <strong className="text-white font-medium">Milestone Fragrance</strong>, a member of the <strong className="text-[#dfb76c] font-medium">Milestone Group of Companies</strong>. These Terms & Conditions govern your access to and use of our website, services, and online purchases.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-stone-500 font-mono">
            <span>Applicable Laws of Pakistan</span>
            <span>•</span>
            <span>Last Updated: November 2026</span>
          </div>
        </header>

        {/* Key Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 sm:mb-16">
          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">100% Authentic Perfumery</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Every blend is an authentic formulation developed using certified premium extracts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">Transparent PKR Pricing</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              All prices are listed clearly in Pakistani Rupees with zero hidden surcharge fees.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">Lahore Jurisdiction</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Legally governed and interpreted under the commercial statutes of Pakistan.
            </p>
          </div>
        </div>

        {/* Terms Body Content */}
        <div className="space-y-8 sm:space-y-10 text-left">
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                01
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Overview & Agreement
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Throughout this website, the terms <strong className="text-white">“we”</strong>, <strong className="text-white">“us”</strong>, and <strong className="text-white">“our”</strong> refer to <strong className="text-[#dfb76c]">Milestone Fragrance</strong>. We operate this site, including all information, tools, and services available to you, conditioned upon your acceptance of all terms, conditions, policies, and notices stated herein.
            </p>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              By visiting our site or purchasing from our catalog, you engage in our Service and agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access our website or use any services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                02
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Online Store Terms & Customer Eligibility
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              By agreeing to these Terms, you represent that you are at least the age of majority in your province of residence (18 years of age in Pakistan) or that you have given consent to allow any of your minor dependents to use this site under your supervision.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300 list-disc pl-5">
              <li>You may not use our fragrances or media assets for any unauthorized commercial or illegal purpose.</li>
              <li>You must not transmit any worms, viruses, malicious code, or perform automated denial-of-service attempts.</li>
              <li>A breach or violation of any of the Terms will result in an immediate termination of your access to our Services.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                03
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Accuracy of Fragrance Information & Olfactory Pyramid
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We make every effort to display the sensory descriptions, olfactory notes (Top, Heart, Base), concentration specifications (Extrait De Parfum / Eau De Parfum), and bottle images as accurately as possible:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300 list-disc pl-5">
              <li>
                <strong className="text-white">Display Variance:</strong> Because screen calibrations, color profiles, and resolutions vary across smartphones and monitors, we cannot guarantee that your display will show the exact shade of packaging glass or fluid coloration.
              </li>
              <li>
                <strong className="text-white">Individual Skin Chemistry:</strong> Scent projection, sillage, and longevity depend significantly on individual skin hydration, ambient temperature, and natural body chemistry.
              </li>
              <li>
                <strong className="text-white">Informational Content:</strong> Historical perfumery notes, application guides, and story blurbs are presented for aesthetic and sensory enjoyment.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                04
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Pricing, Currency & Order Acceptance
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              All prices for Milestone Fragrances are quoted in <strong className="text-white">Pakistani Rupees (PKR)</strong>:
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80">
                <h4 className="text-[#dfb76c] text-xs sm:text-sm font-semibold mb-1">
                  Price Adjustments
                </h4>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Prices of our formulations are subject to adjustment without prior notice due to fluctuations in raw essence market costs and currency exchange rates.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80">
                <h4 className="text-[#dfb76c] text-xs sm:text-sm font-semibold mb-1">
                  Right to Limit or Cancel Orders
                </h4>
                <p className="text-stone-400 text-xs leading-relaxed">
                  We reserve the right to limit the sales of our fragrances to any person, geographic region, or jurisdiction. We reserve the right to refuse or cancel any order (e.g., in cases of suspected fraudulent reselling, incomplete shipping addresses, or unconfirmed Cash on Delivery phone verifications).
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                05
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Intellectual Property & Trademarks
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              All content on this website—including but not limited to the <strong className="text-[#dfb76c]">Milestone Fragrance</strong> mark, the Milestone geometric crest emblem, product names (e.g. Signature, Believe, Ghanam, Professor), formulation descriptions, product photography, bottle renderings, typography, and graphic layouts—is the exclusive intellectual property of the <strong className="text-white">Milestone Group of Companies</strong>, protected under the Copyright and Trademark laws of Pakistan and international treaties.
            </p>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Any unauthorized reproduction, copying, distribution, or commercial exploitation without our prior written consent is strictly prohibited.
            </p>
          </section>

          {/* Section 6 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                06
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Customer Reviews & Testimonials
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              If you submit a customer review, rating, comment, or testimonial regarding your experience with our perfumes:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300 list-disc pl-5">
              <li>You warrant that your review reflects an authentic, genuine personal purchase and experience.</li>
              <li>You grant Milestone Fragrance a non-exclusive, royalty-free license to publish, display, or quote your review on our website and social channels.</li>
              <li>We reserve the right to moderate or remove reviews containing profanity, defamatory remarks, competitor advertising, or personal private details.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                07
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Disclaimer of Warranties & Limitation of Liability
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Our website and catalog products are provided on an 'as is' and 'as available' basis. To the fullest extent permissible under Pakistani law:
            </p>
            <div className="p-4 rounded-xl bg-[#1a1714] border border-[#dfb76c]/30 text-stone-300 text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#dfb76c] font-semibold text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Cosmetic & External Application Notice</span>
              </div>
              <p className="leading-relaxed">
                All fragrances manufactured by Milestone Fragrance are designed exclusively for external cosmetic application on skin and clothing. Do not ingest or spray directly into eyes, mucous membranes, or onto irritated skin. Milestone Fragrance and Milestone Group of Companies shall not be held liable for any allergic reaction arising from undisclosed personal sensitivity to natural essential oils. Always perform a patch test on a small area of skin before extensive use.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                08
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Governing Law & Dispute Resolution
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by, construed, and enforced in accordance with the laws of the <strong className="text-white">Islamic Republic of Pakistan</strong>. Any legal dispute, arbitration, or proceeding arising under these Terms shall be subject to the exclusive jurisdiction of the competent civil courts situated in <strong className="text-[#dfb76c]">Lahore, Pakistan</strong>.
            </p>
          </section>

          {/* Section 9 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                09
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Changes to Terms of Service
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change, or replace any part of these Terms by posting updates on our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website following the posting of any changes constitutes acceptance of those changes.
            </p>
          </section>
        </div>

        {/* Contact Concierge Support Banner */}
        <div className="mt-14 sm:mt-18 p-8 rounded-2xl bg-gradient-to-b from-[#1a1714] to-[#14120f] border border-[#dfb76c]/30 text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
              Questions Regarding Our Terms?
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto">
              Our legal counsel and customer support desk are available to provide clear answers regarding our service terms and policies.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-stone-300">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 hover:text-[#dfb76c] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#dfb76c]" />
              <span>{contactEmail}</span>
            </a>

            <a
              href={`tel:${contactPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 hover:text-[#dfb76c] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#dfb76c]" />
              <span>{contactPhone}</span>
            </a>

            <div className="flex items-center gap-2 text-stone-400">
              <MapPin className="w-4 h-4 text-[#dfb76c]" />
              <span>{contactAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
