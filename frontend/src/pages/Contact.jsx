import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { submitContact } from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitContact(form);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: 'How long does Milestone Fragrance last?',
      a: 'All our perfumes are formulated at high Eau De Parfum / Extrait concentrations (25%+ essence oils). On skin, you can expect 8 to 12+ hours, and on garments/clothing, they often linger for several days.',
    },
    {
      q: 'How does shipping and delivery work?',
      a: 'We offer free delivery across Pakistan for all orders over Rs. 5,000. For orders under Rs. 5,000, a flat shipping fee of Rs. 250 applies. Deliveries inside Lahore take 24-48 hours; major cities take 2-4 business days.',
    },
    {
      q: 'Can I test before purchasing or exchange my bottle?',
      a: 'Yes, we provide an easy 7-day hassle-free return and exchange policy on all unopened bottles in their original shrink-wrap and packaging.',
    },
    {
      q: 'Are your fragrances unisex or gender specific?',
      a: 'While we organize fragrances into Men, Women, and Unisex collections based on classic fragrance notes, scent is an intimate personal choice. Many women adore our smoky Professor, and many men love the fresh zest of Believe.',
    },
  ];

  return (
    <div className="w-full bg-[#0d0c0a] text-stone-200 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[#dfb76c] text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            GET IN TOUCH
          </p>
          <h1 className="text-3xl sm:text-5xl font-serif text-white font-normal mb-4">
            We Are Here For You
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm font-light">
            Have questions about finding your signature scent, tracking an order, or custom corporate gifting? Our concierge team is ready to assist.
          </p>
        </div>

        {/* Contact info cards + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="p-5 rounded-xl bg-[#14120f] border border-[#262018] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-0.5">Call / WhatsApp</h4>
                <a href="tel:+923001234567" className="text-stone-400 hover:text-[#dfb76c] text-xs block transition-colors">
                  +92 300 1234567
                </a>
                <span className="text-stone-500 text-[11px]">Mon - Sat: 10:00 AM - 9:00 PM</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#14120f] border border-[#262018] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-0.5">Email Support</h4>
                <a href="mailto:info@milestonefragrances.pk" className="text-stone-400 hover:text-[#dfb76c] text-xs block transition-colors">
                  info@milestonefragrances.pk
                </a>
                <span className="text-stone-500 text-[11px]">Average response time &lt; 2 hours</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#14120f] border border-[#262018] flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#dfb76c]/10 text-[#dfb76c] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold mb-0.5">Flagship Showroom</h4>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Gulberg III / DHA Phase 5, Lahore, Pakistan
                </p>
                <span className="text-stone-500 text-[11px]">Private scent testing available</span>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-[#14120f] border border-[#262018] p-6 sm:p-8 rounded-xl text-left">
            <h3 className="text-xl font-serif text-white mb-2">Send Us a Message</h3>
            <p className="text-stone-400 text-xs mb-6">
              Fill out the form below and our fragrance advisors will respond shortly.
            </p>

            {sent ? (
              <div className="p-6 rounded-lg bg-[#1a1713] border border-[#dfb76c]/40 text-[#dfb76c] flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Message Dispatched!</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Thank you for reaching out. One of our concierges will contact you soon.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-stone-400 block mb-1.5 font-medium">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ali Ahmed"
                      className="w-full bg-[#181512] border border-stone-800 focus:border-[#dfb76c] text-stone-200 placeholder-stone-600 text-xs rounded px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-400 block mb-1.5 font-medium">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ali@example.com"
                      className="w-full bg-[#181512] border border-stone-800 focus:border-[#dfb76c] text-stone-200 placeholder-stone-600 text-xs rounded px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1.5 font-medium">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#181512] border border-stone-800 focus:border-[#dfb76c] text-stone-200 placeholder-stone-600 text-xs rounded px-3.5 py-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1.5 font-medium">Your Message *</label>
                  <textarea
                    required
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you are looking for..."
                    className="w-full bg-[#181512] border border-stone-800 focus:border-[#dfb76c] text-stone-200 placeholder-stone-600 text-xs rounded px-3.5 py-2.5 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#dfb76c] hover:bg-[#caa053] text-black font-semibold text-xs sm:text-sm px-6 py-3 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="pt-10 border-t border-stone-800 max-w-4xl mx-auto text-left">
          <h2 className="text-2xl font-serif text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-[#262018] bg-[#14120f] rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left text-sm font-semibold text-stone-200 hover:text-[#dfb76c] focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#dfb76c] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-stone-400 leading-relaxed border-t border-stone-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
