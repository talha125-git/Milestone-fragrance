import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { logo, paymentMethods } from '../assets';
import {
  loadStoredSettings,
  fetchSettingsFromServer,
  SETTINGS_UPDATED_EVENT,
} from '../data/settings';

export default function Footer({ onNavigate }) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(loadStoredSettings);

  useEffect(() => {
    // Initial fetch from backend API
    fetchSettingsFromServer().then((latest) => {
      if (latest) setSettings(latest);
    });

    // Real-time synchronization when admin updates settings
    const handleSettingsUpdated = (event) => {
      if (event.detail) {
        setSettings(event.detail);
      } else {
        setSettings(loadStoredSettings());
      }
    };

    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
    window.addEventListener('storage', handleSettingsUpdated);

    return () => {
      window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
      window.removeEventListener('storage', handleSettingsUpdated);
    };
  }, []);

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

  // Exactly 4 social networks: Facebook, Instagram, TikTok, YouTube
  const socialPlatforms = [
    {
      name: 'Facebook',
      key: 'facebook',
      url: settings?.socialLinks?.facebook || 'https://facebook.com',
      icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    },
    {
      name: 'Instagram',
      key: 'instagram',
      url: settings?.socialLinks?.instagram || 'https://instagram.com',
      icon: 'M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zm-4 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm4.5-7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z',
    },
    {
      name: 'TikTok',
      key: 'tiktok',
      url: settings?.socialLinks?.tiktok || 'https://tiktok.com',
      icon: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.32V9.45a8.16 8.16 0 0 0 4.91 1.63V7.64a4.85 4.85 0 0 1-1-.95z',
    },
    {
      name: 'YouTube',
      key: 'youtube',
      url: settings?.socialLinks?.youtube || 'https://youtube.com',
      icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    },
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

            {/* Social Icons: Only Facebook, Instagram, TikTok, YouTube */}
            <div className="flex items-center gap-3 pt-2">
              {socialPlatforms.map((social) => (
                <a
                  key={social.key}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Milestone Fragrance on ${social.name}`}
                  title={`${social.name}: ${social.url}`}
                  className="w-8 h-8 rounded-full border border-stone-800 hover:border-[#dfb76c] bg-[#14120f]/80 hover:bg-[#dfb76c] text-stone-400 hover:text-[#0d0c0a] flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 focus:outline-none cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d={social.icon} />
                  </svg>
                </a>
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

          {/* Column 4: Contact Us & Store Location */}
          <div className="lg:col-span-3 text-left space-y-3">
            <h4 className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#dfb76c]">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs sm:text-[13px] text-stone-400">
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                <a
                  href={`mailto:${settings?.email || 'info@milestonefragrances.pk'}`}
                  className="hover:text-white transition-colors"
                >
                  {settings?.email || 'info@milestonefragrances.pk'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                <a
                  href={`tel:${(settings?.phone || '+92 300 1234567').replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {settings?.phone || '+92 300 1234567'}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0 mt-0.5" />
                <span title={settings?.address || settings?.location}>
                  {settings?.location || 'Lahore, Pakistan'}
                </span>
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
