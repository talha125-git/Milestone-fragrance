import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import PolicyNavTabs from '../components/PolicyNavTabs';
import { loadStoredSettings, fetchSettingsFromServer, SETTINGS_UPDATED_EVENT } from '../data/settings';

export default function PrivacyPolicy() {
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
        <PolicyNavTabs activePolicy="privacy" />

        {/* Hero Title Header */}
        <header className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dfb76c]/10 border border-[#dfb76c]/30 text-[#dfb76c] text-xs font-semibold uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Customer Privacy & Data Protection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
            Privacy Policy
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            This Privacy Policy describes how <strong className="text-white font-medium">Milestone Fragrance</strong> (a division of the <strong className="text-[#dfb76c] font-medium">Milestone Group of Companies</strong>) collects, uses, and safeguards your personal information when you visit our website, interact with our concierge, or place an order.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-stone-500 font-mono">
            <span>Jurisdiction: Pakistan</span>
            <span>•</span>
            <span>Last Updated: November 2026</span>
          </div>
        </header>

        {/* Key Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 sm:mb-16">
          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">256-Bit SSL Protection</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              All checkout sessions and sensitive credentials are encrypted using industry-standard protocols.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">No Data Selling</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              We never sell, rent, or trade your personal contact details or purchasing habits to third parties.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">Pakistani Law Compliance</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Operated in strict compliance with consumer protection and electronic transaction laws of Pakistan.
            </p>
          </div>
        </div>

        {/* Policy Body Content */}
        <div className="space-y-8 sm:space-y-10 text-left">
          {/* Section 1 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                01
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Information We Collect
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              When you browse our catalog, register an account, or place an order, we may collect several types of information necessary to deliver exceptional perfumery experiences:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  Contact Information
                </span>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Your full name, email address, mobile/WhatsApp contact number, and accurate residential/commercial delivery address across Pakistan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  Order & Transaction Data
                </span>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Purchased fragrances (e.g. Signature, Professor, Believe, Ghanam), bottle sizes (10ml, 30ml, 50ml, 100ml), transaction amounts in PKR, and courier tracking details.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  Concierge Communications
                </span>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Records of communications with our team via WhatsApp, phone calls, or official email inquiries regarding olfactory notes, exchanges, and recommendations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  Technical & Browsing Data
                </span>
                <p className="text-stone-400 text-xs leading-relaxed">
                  IP address, browser type, device information, operating system, pages visited, session duration, and referral sources to optimize storefront performance.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                02
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                How We Use Your Information
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We process personal information under legitimate business interests, contract fulfillment, and explicit customer consent for the following purposes:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300 list-disc pl-5">
              <li>
                <strong className="text-white">Order Fulfillment & Delivery:</strong> Packing your perfumes, generating shipping labels, and coordinating dispatch with our courier logistics partners.
              </li>
              <li>
                <strong className="text-white">Customer Support & Inquiries:</strong> Answering questions about scent pyramids, longevity, formula concentrations, order status, and address revisions.
              </li>
              <li>
                <strong className="text-white">Personalized Fragrance Experience:</strong> Tailoring recommendations (Woody, Citrus, Fresh, Floral, Oriental) based on past purchases and wishlist items.
              </li>
              <li>
                <strong className="text-white">Order Notifications:</strong> Sending automated email or SMS notifications regarding order confirmations, out-for-delivery alerts, and courier tracking codes.
              </li>
              <li>
                <strong className="text-white">Fraud Prevention & Security:</strong> Verifying high-value orders and preventing unauthorized access or suspicious activities.
              </li>
              <li>
                <strong className="text-white">VIP Club & Newsletters:</strong> Sharing new perfume launches, artisanal blend announcements, and seasonal Eid offers (only if you subscribe).
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                03
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Sharing Your Information
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We value your trust and do not sell your personal details to advertising brokers. Information is shared only with verified partners strictly essential for order execution:
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80">
                <h4 className="text-[#dfb76c] text-xs sm:text-sm font-semibold mb-1">
                  1. Domestic & International Couriers
                </h4>
                <p className="text-stone-400 text-xs leading-relaxed">
                  We share your recipient name, phone number, and delivery address with vetted logistics services (such as TCS, Leopards Courier, Trax, Call Courier, and PostEx) strictly to deliver your package and collect Cash on Delivery (COD).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80">
                <h4 className="text-[#dfb76c] text-xs sm:text-sm font-semibold mb-1">
                  2. Payment Gateways & Banking Partners
                </h4>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Online payments via Debit/Credit card or digital wallets are handled through certified PCI-DSS compliant payment gateways. Milestone Fragrance never views or stores raw credit card numbers or banking passwords.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80">
                <h4 className="text-[#dfb76c] text-xs sm:text-sm font-semibold mb-1">
                  3. Legal & Regulatory Compliance
                </h4>
                <p className="text-stone-400 text-xs leading-relaxed">
                  We may disclose information if required by Pakistani statutory regulations, court orders, or law enforcement authorities to protect public safety and prevent fraud.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                04
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Data Security & Vault Protection
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We implement comprehensive technical, physical, and administrative safeguards to ensure the confidentiality of your personal information:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300 list-disc pl-5">
              <li>All web traffic between your device and our servers is secured with HTTPS 256-Bit SSL encryption.</li>
              <li>Administrative access to customer orders and contact directories is restricted by multi-factor authentication.</li>
              <li>Data servers undergo regular maintenance, security patching, and vulnerability auditing.</li>
            </ul>
            <div className="p-4 rounded-xl bg-[#1a1714] border border-[#dfb76c]/30 text-stone-300 text-xs flex items-start gap-3 mt-3">
              <AlertCircle className="w-4 h-4 text-[#dfb76c] flex-shrink-0 mt-0.5" />
              <span>
                While we employ stringent safeguards, no electronic transmission over the internet is completely immune. Please ensure your account password remains confidential and never share SMS one-time passcodes with anyone.
              </span>
            </div>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                05
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Your Rights & Choices
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              You maintain full ownership of your personal data. At any time, you have the right to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#191612] border border-stone-800/80">
                <h4 className="text-white text-xs font-semibold mb-1">Access & Rectification</h4>
                <p className="text-stone-400 text-xs">Request a copy of your stored records or request corrections to your delivery address and contact phone number.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-stone-800/80">
                <h4 className="text-white text-xs font-semibold mb-1">Account & Data Erasure</h4>
                <p className="text-stone-400 text-xs">Request complete deletion of your customer profile, order logs, and wishlist history from our database.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-stone-800/80">
                <h4 className="text-white text-xs font-semibold mb-1">Marketing Opt-Out</h4>
                <p className="text-stone-400 text-xs">Unsubscribe from promotional emails or promotional WhatsApp broadcasts at any time with a single reply or link click.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-stone-800/80">
                <h4 className="text-white text-xs font-semibold mb-1">Cookie Control</h4>
                <p className="text-stone-400 text-xs">Adjust your web browser preferences to decline or clear cookies used for shopping cart persistence.</p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                06
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Policy Updates & Revisions
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We may periodically revise this Privacy Policy to reflect advancements in technology, enhancements to our perfumery services, or updates in statutory laws in Pakistan. Any revisions will be published on this URL with an updated effective date. Continued use of our website signifies your acceptance of the revised terms.
            </p>
          </section>
        </div>

        {/* Contact Concierge Support Banner */}
        <div className="mt-14 sm:mt-18 p-8 rounded-2xl bg-gradient-to-b from-[#1a1714] to-[#14120f] border border-[#dfb76c]/30 text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
              Have Questions About Your Privacy?
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto">
              Our concierge team and data compliance desk are at your disposal. Get in touch directly for immediate assistance.
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
