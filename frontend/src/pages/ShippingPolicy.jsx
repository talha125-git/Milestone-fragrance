import React, { useEffect, useState } from 'react';
import {
  Truck,
  Package,
  Clock,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Globe2,
  DollarSign,
} from 'lucide-react';
import PolicyNavTabs from '../components/PolicyNavTabs';
import { loadStoredSettings, fetchSettingsFromServer, SETTINGS_UPDATED_EVENT } from '../data/settings';

export default function ShippingPolicy() {
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
        <PolicyNavTabs activePolicy="shipping" />

        {/* Hero Title Header */}
        <header className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dfb76c]/10 border border-[#dfb76c]/30 text-[#dfb76c] text-xs font-semibold uppercase tracking-[0.2em]">
            <Truck className="w-3.5 h-3.5" />
            <span>Fast, Secure & Insured Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal leading-tight">
            Shipping & Delivery Policy
          </h1>

          <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
            At <strong className="text-white font-medium">Milestone Fragrance</strong>, every bottle is an artisanal formulation cushioned with care to reach you in pristine luxury condition across Pakistan and worldwide.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-stone-500 font-mono">
            <span>Nationwide COD Available</span>
            <span>•</span>
            <span>Free Delivery Over PKR 5,000</span>
          </div>
        </header>

        {/* Key Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 sm:mb-16">
          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">1–2 Business Days Dispatch</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Orders are packaged and dispatched swiftly from our central distribution hub in Lahore.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">Free Delivery Above PKR 5,000</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Complimentary insured shipping nationwide on all orders meeting the PKR 5,000 threshold.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#14120f] border border-[#262019] text-left space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-white text-xs sm:text-sm font-semibold">100% Transit Insurance</h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Full transit protection against breakage or leakage with immediate no-hassle bottle replacement.
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
                Order Processing & Dispatch Timelines
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              All orders placed on our website undergo verification before handoff to our logistics partners:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300 list-disc pl-5">
              <li>
                <strong className="text-white">Standard Processing Window:</strong> Orders are verified, luxury-boxed, and dispatched within <strong className="text-[#dfb76c]">1 to 2 business days</strong> (Monday through Saturday).
              </li>
              <li>
                <strong className="text-white">Weekends & Public Holidays:</strong> Orders placed on Sundays or gazetted public holidays in Pakistan will be processed on the following business day.
              </li>
              <li>
                <strong className="text-white">Order Verification Call/SMS:</strong> For first-time Cash on Delivery (COD) orders, our verification team may reach out via SMS or phone call to confirm your delivery address before release.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                02
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Shipping Methods & Estimated Delivery Durations
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We partner with Pakistan's premier courier networks (including TCS, Leopards, Trax, Call Courier, and PostEx) to ensure fast and dependable deliveries:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  Major Metropolitan Cities
                </span>
                <div className="text-white text-base sm:text-lg font-serif font-bold">2 to 4 Business Days</div>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, and Peshawar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  All Other Cities & Regions
                </span>
                <div className="text-white text-base sm:text-lg font-serif font-bold">3 to 6 Business Days</div>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Covering Sialkot, Gujranwala, Hyderabad, Quetta, Sukkur, Abbottabad, and nationwide.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#191612] border border-stone-800/80 space-y-1">
                <span className="text-[#dfb76c] text-xs font-semibold uppercase tracking-wider block">
                  International Shipping
                </span>
                <div className="text-white text-base sm:text-lg font-serif font-bold">7 to 21 Business Days</div>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Shipped via specialized dangerous goods air-freight based on country customs regulations.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                03
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Shipping Rates & Free Delivery Threshold
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Our shipping pricing is transparent and straightforward:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#1a1714] to-[#14120f] border border-[#dfb76c]/40 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#dfb76c]/20 text-[#dfb76c] text-[10px] font-bold tracking-wider uppercase">
                  Best Value
                </div>
                <h3 className="text-white text-base sm:text-lg font-serif font-bold">
                  FREE Nationwide Delivery
                </h3>
                <p className="text-stone-300 text-xs leading-relaxed">
                  Orders totaling <strong className="text-white">PKR 5,000 or above</strong> automatically qualify for zero shipping charges anywhere in Pakistan.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#191612] border border-stone-800/80 space-y-2">
                <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider block">
                  Standard Flat Rate
                </span>
                <h3 className="text-white text-base sm:text-lg font-serif font-bold">
                  Rs. 250 Flat Rate
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  For orders under PKR 5,000, a minimal flat shipping fee of PKR 250 is calculated and displayed at checkout.
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
                Tracking Your Fragrance Order
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              We provide end-to-end parcel visibility from our hands to yours:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300 list-disc pl-5">
              <li>
                <strong className="text-white">Dispatch Notification:</strong> Once your parcel is scanned by the courier, you will receive an automatic email and SMS containing your direct <strong className="text-[#dfb76c]">Tracking Number</strong>.
              </li>
              <li>
                <strong className="text-white">Live Courier Tracking:</strong> Click the tracking link in your message to monitor parcel movements, arrival at your city depot, and rider dispatch.
              </li>
              <li>
                <strong className="text-white">Delivery Delays:</strong> Weather conditions, unexpected roadblock diversions, or remote area logistics may occasionally introduce minor delays. Our concierge team proactively tracks delayed packages.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                05
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                Damaged, Leaking, or Tampered Parcels
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Every Milestone bottle is double-checked and encased in heavy, crush-resistant packaging. In the unlikely circumstance that your package arrives visibly damaged:
            </p>
            <div className="p-4 rounded-xl bg-[#1a1714] border border-[#dfb76c]/40 text-stone-300 text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#dfb76c] font-semibold text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>48-Hour Free Replacement Guarantee</span>
              </div>
              <p className="leading-relaxed">
                Please do not accept an open or leaking box from the courier rider, or record a quick video/photo upon unboxing. Reach out to our concierge via WhatsApp (<a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="text-white underline">{contactPhone}</a>) or email within <strong className="text-white">48 hours</strong> of delivery. We will arrange a free immediate replacement bottle at zero additional cost to you.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="p-6 sm:p-8 rounded-2xl bg-[#14120f] border border-[#262019] space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] text-xs font-bold flex items-center justify-center flex-shrink-0">
                06
              </span>
              <h2 className="text-lg sm:text-xl font-serif text-white font-semibold">
                International Orders & Customs Regulations
              </h2>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              For customers ordering outside Pakistan:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300 list-disc pl-5">
              <li>
                Perfumes contain high concentrations of organic essence oils and perfumer’s alcohol, classified as <em>Dangerous Goods / Class 3 Flammable Liquids</em> under international aviation regulations.
              </li>
              <li>
                International orders are shipped via licensed international couriers complying with global air-cargo regulations.
              </li>
              <li>
                <strong className="text-white">Customs, Import Taxes & Duties:</strong> Any import duties, local clearance fees, or VAT levied by the destination country’s customs authority are the sole responsibility of the customer.
              </li>
            </ul>
          </section>
        </div>

        {/* Contact Concierge Support Banner */}
        <div className="mt-14 sm:mt-18 p-8 rounded-2xl bg-gradient-to-b from-[#1a1714] to-[#14120f] border border-[#dfb76c]/30 text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
              Need Help With Your Shipment?
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto">
              Our dispatch department is ready to assist with address updates, express delivery queries, or parcel tracking inquiries.
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
