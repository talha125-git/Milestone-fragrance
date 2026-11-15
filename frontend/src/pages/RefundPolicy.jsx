import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldAlert,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  HelpCircle,
  BadgeAlert,
} from 'lucide-react';
import PolicyNavTabs from '../components/PolicyNavTabs';
import { loadStoredSettings, fetchSettingsFromServer, SETTINGS_UPDATED_EVENT } from '../data/settings';

export default function RefundPolicy() {
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
        <PolicyNavTabs activePolicy="refund" />

        {/* Hero Title Header */}
        <header className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dfb76c]/10 border border-[#dfb76c]/30 text-[#dfb76c] text-xs font-semibold uppercase tracking-[0.2em]">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Customer Satisfaction & Confidence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
            Return & Refund Policy
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            At <strong className="text-white font-medium">Milestone Fragrance Pakistan</strong>, we strive to ensure total delight with every bottle you acquire. If you are not completely satisfied, we provide a structured <strong className="text-[#dfb76c] font-medium">4 to 7 business day return & exchange window</strong> for domestic orders.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-stone-500 font-mono">
            <span>Domestic (Pakistan) Orders</span>
            <span>•</span>
            <span>Hassle-Free Exchange Desk</span>
          </div>
        </header>

        {/* Key Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 sm:mb-16">
          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">4–7 Days Return Window</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Initiate an exchange or return within 4 to 7 business days from the delivery date.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">Seamless Exchanges</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Exchange your unopened fragrance for any other scent in our catalog smoothly.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">Defect & Transit Guarantee</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              100% free bottle replacement if received cracked, defective, or incorrect.
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
                Eligibility for Returns & Exchanges (Pakistan Orders)
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Due to strict cosmetics and olfactory hygiene regulations, an item is eligible for return or exchange only if it satisfies all of the following conditions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  Original Sealed Condition
                </span>
                <p className="text-stone-400 text-xs leading-relaxed">
                  The perfume box must remain unopened, unused, with its transparent cellophane shrink-wrap, security seals, and serial tags completely intact.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  Proof of Purchase
                </span>
                <p className="text-stone-400 text-xs leading-relaxed">
                  You must provide a valid order confirmation number (e.g. ORD-XXXX), invoice copy, or the registered phone number used during checkout.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  Timeline Compliance
                </span>
                <p className="text-stone-400 text-xs leading-relaxed">
                  The return or exchange request must be officially logged with our team within <strong className="text-white">4 to 7 business days</strong> of parcel receipt.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  Prior Concierge Approval
                </span>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Returns sent back to our warehouse without prior written authorization from our team will not be accepted by our receiving dock.
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
                Damaged, Defective, or Incorrect Deliveries
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We take full responsibility for transit risks and manufacturing integrity:
            </p>
            <div className="p-4 rounded-xl bg-[#1a1714] border border-[#dfb76c]/40 text-stone-300 text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#dfb76c] font-semibold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>100% Free Immediate Replacement or Full Refund</span>
              </div>
              <p className="leading-relaxed">
                If your perfume arrives with a cracked bottle, leaking seal, malfunctioning atomizer spray pump, or an incorrect fragrance was dispatched by our warehouse:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-stone-400">
                <li>Capture clear photos and a brief video clip of the package and bottle issue.</li>
                <li>Report the issue to our WhatsApp concierge within <strong className="text-white">48 hours</strong> of delivery.</li>
                <li>We will dispatch a brand-new replacement bottle via express courier or issue a 100% refund, covering all logistics costs.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                03
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                How to Initiate an Exchange or Return (Step-by-Step)
              </h2>
            </div>
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#dfb76c]/20 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-white text-xs sm:text-sm font-semibold">Contact Concierge</h4>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Message us on WhatsApp at <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="text-[#dfb76c] underline">{contactPhone}</a> or email <a href={`mailto:${contactEmail}`} className="text-[#dfb76c] underline">{contactEmail}</a> with your Order ID and the reason for exchange.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#dfb76c]/20 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-white text-xs sm:text-sm font-semibold">Receive Return Approval & Courier Instructions</h4>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Once verified, our team issues an authorized Return Merchandise docket and advises whether our partner courier will pick up from your door or if you should send it to our warehouse.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#dfb76c]/20 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-white text-xs sm:text-sm font-semibold">Inspection & Dispatch</h4>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    Upon receipt and visual inspection of seals at our atelier, your exchange fragrance is packed and dispatched immediately using standard tracked delivery.
                  </p>
                </div>
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
                Refund Method & Timelines
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              If an approved return warrants a monetary refund rather than a fragrance exchange:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300 list-disc pl-5">
              <li>
                <strong className="text-white">Processing Duration:</strong> Refunds are approved within <strong className="text-[#dfb76c]">5 to 7 business days</strong> following inspection of returned sealed goods.
              </li>
              <li>
                <strong className="text-white">Cash on Delivery (COD) Orders:</strong> Refunds are transferred directly to your nominated Pakistani Bank Account (IBAN), JazzCash, or EasyPaisa mobile account.
              </li>
              <li>
                <strong className="text-white">Prepaid Card Orders:</strong> Reversals are credited back to the original credit/debit card used during checkout (processing time subject to your issuing bank).
              </li>
              <li>
                <strong className="text-white">Shipping Fees:</strong> Original courier shipping fees (if any) are non-refundable unless the return was necessitated by our warehouse error or a transit defect.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                05
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Non-Returnable & Non-Refundable Items
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              To preserve authentic luxury standards, quality control, and health safety, we cannot accept returns or issue refunds under the following scenarios:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#191612] border border-stone-800/80">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  <span>Opened or Sprayed Bottles</span>
                </div>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Any perfume bottle with broken shrink-wrap, damaged seals, or that has been sprayed cannot be returned.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-stone-800/80">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  <span>Personal Scent Preference Dislike</span>
                </div>
                <p className="text-stone-400 text-xs leading-relaxed">
                  We cannot accept returns for bottles that have been tested and disliked based on subjective scent taste. We encourage reviewing notes beforehand.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-stone-800/80">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  <span>International Dispatched Orders</span>
                </div>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Due to international airline hazardous goods regulations on liquids, cross-border returns cannot be accepted once shipped.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#191612] border border-stone-800/80">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
                  <BadgeAlert className="w-3.5 h-3.5" />
                  <span>Promotional & Final Sale Items</span>
                </div>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Sample vials, discovery sets, free gift items, and products explicitly marked as 'Final Clearance' are non-returnable.
                </p>
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
                Authorized Return Hub Address
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Approved returns must be sent securely packaged with bubble wrap to ensure safe arrival:
            </p>
            <div className="p-4 rounded-xl bg-[#191612] border border-[#dfb76c]/30 text-stone-300 text-xs space-y-1.5 font-mono">
              <div className="text-white font-bold text-sm">Milestone Fragrance Returns Department</div>
              <div className="text-stone-400">Milestone Group of Companies Atelier</div>
              <div className="text-stone-400">{contactAddress}</div>
              <div className="text-[#dfb76c] pt-1">Contact: {contactPhone} | {contactEmail}</div>
            </div>
          </section>
        </div>

        {/* Contact Concierge Support Banner */}
        <div className="mt-14 sm:mt-18 p-8 rounded-2xl bg-gradient-to-b from-[#1a1714] to-[#14120f] border border-[#dfb76c]/30 text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center mx-auto">
            <RotateCcw className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
              Need to Exchange or Return a Fragrance?
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto">
              Our customer happiness team will guide you through an effortless exchange so you find the scent that truly defines you.
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
