import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { logo, paymentMethods } from '../assets';

export default function Footer({ onNavigate }) {
  const navigate = useNavigate();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Men', path: '/men' },
    { name: 'Women', path: '/women' },
    { name: 'Unisex', path: '/unisex' },
    { name: 'Collections', path: '/collections' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = (path) => {
    navigate(path);
    if (onNavigate) onNavigate(path);
  };

  const customerCare = [
    'Shipping Policy',
    'Return Policy',
    'FAQs',
    'Terms & Conditions',
    'Privacy Policy',
  ];

  return (
    <footer className="w-full bg-[#0a0908] text-stone-300 pt-14 pb-8 border-t border-[#1e1914]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-[#201b16]">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <button
              onClick={() => handleLinkClick('/')}
              className="focus:outline-none block cursor-pointer"
            >
              <img
                src={logo}
                alt="Milestone Fragrances"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </button>

            <p className="text-stone-400 text-xs sm:text-[13px] font-light leading-relaxed max-w-sm">
              Premium fragrances for modern souls. Crafted to make every moment unforgettable.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { name: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                { name: 'Instagram', icon: 'M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zm-4 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.5-7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z' },
                { name: 'TikTok', icon: 'M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-5-1.7V16a8 8 0 1 1-8-8c.7 0 1.3.1 2 .2V11a4 4 0 0 0-2 1z' },
                { name: 'YouTube', icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z' },
                { name: 'Pinterest', icon: 'M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 .1-2.9l1.4-5.9s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4a1.2 1.2 0 0 0 1.2 1.5c1.4 0 2.5-1.5 2.5-3.7 0-1.9-1.4-3.3-3.4-3.3-2.5 0-4 1.8-4 3.8 0 .8.3 1.6.7 2 .1.1.1.2.1.3l-.3 1.1c-.1.2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.5 2.6 6.5 6.1 0 3.6-2.3 6.6-5.5 6.6-1.1 0-2.1-.6-2.4-1.3l-.7 2.6c-.3 1-1 2.3-1.5 3.1A10 10 0 1 0 12 2z' },
              ].map((social, idx) => (
                <button
                  key={idx}
                  aria-label={social.name}
                  className="w-7 h-7 rounded-full border border-stone-800 hover:border-[#dfb76c] text-stone-400 hover:text-[#dfb76c] flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 text-left space-y-3">
            <h4 className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#dfb76c]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => handleLinkClick(link.path)}
                    className="text-stone-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="lg:col-span-3 text-left space-y-3">
            <h4 className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#dfb76c]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px]">
              {customerCare.map((item, idx) => (
                <li key={idx}>
                  <a
                    href="#customer-care"
                    onClick={(e) => e.preventDefault()}
                    className="text-stone-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3 text-left space-y-3">
            <h4 className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#dfb76c]">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs sm:text-[13px] text-stone-400">
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                <a
                  href="mailto:info@milestonefragrances.pk"
                  className="hover:text-white transition-colors"
                >
                  info@milestonefragrances.pk
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                <a
                  href="tel:+923001234567"
                  className="hover:text-white transition-colors"
                >
                  +92 300 1234567
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2025 Milestone Fragrances. All rights reserved.
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400">We Accept</span>
            <img
              src={paymentMethods}
              alt="Payment Methods - Visa, MasterCard, UnionPay, COD"
              className="h-4 sm:h-5 w-auto object-contain brightness-110"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

