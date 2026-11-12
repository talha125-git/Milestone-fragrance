import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Truck, Menu, X } from 'lucide-react';
import { logo } from '../assets';

export default function Header({
  currentPage,
  setCurrentPage,
  cartCount,
  setIsCartOpen,
  wishlistCount,
  setIsWishlistOpen,
  setIsSearchOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasSolidBg = isScrolled || mobileMenuOpen;

  const navLinks = [
    { name: 'Home', path: '/', id: 'home' },
    { name: 'New Arrivals', path: '/new-arrivals', id: 'new-arrivals' },
    { name: 'Men', path: '/men', id: 'men' },
    { name: 'Women', path: '/women', id: 'women' },
    { name: 'Unisex', path: '/unisex', id: 'unisex' },
    { name: 'Collections', path: '/collections', id: 'collections' },
    { name: 'About', path: '/about', id: 'about' },
    { name: 'Contact', path: '/contact', id: 'contact' },
  ];

  const isLinkActive = (link) => {
    const p = location.pathname;
    if (link.path === '/') return p === '/';
    if (link.path === '/collections') {
      return p === '/collections' || p.startsWith('/products/') || p.startsWith('/product/');
    }
    return p === link.path || p.startsWith(link.path);
  };

  const handleNavClick = (link) => {
    navigate(link.path);
    if (setCurrentPage) setCurrentPage(link.id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 pb-6 z-40 w-full transition-all duration-300 ease-in-out ${hasSolidBg
        ? 'bg-[#0d0c0a]/95 backdrop-blur-md border-b border-[#221e1a]/80 shadow-lg shadow-black/40'
        : 'bg-transparent border-b border-transparent shadow-none'
        }`}
    >
      {/* Top Announcement Bar - Visible on top, hides on scroll */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden text-[#dfb76c] text-[11px] sm:text-xs tracking-wider font-medium ${isScrolled
          ? 'max-h-0 opacity-0 py-0 border-none pointer-events-none'
          : 'max-h-12 opacity-100 py-2 bg-black/40 backdrop-blur-xs border-b border-white/10'
          }`}
      >
        <div className="flex w-max animate-marquee">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="flex shrink-0">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 mx-8 sm:mx-12 whitespace-nowrap"
                >
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    FREE DELIVERY ON ORDERS OVER RS. 5,000
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>


      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex flex-col items-center py-1">
          <button
            onClick={() => handleNavClick(navLinks[0])}
            className="flex items-center mt-6 justify-center group focus:outline-none cursor-pointer"
          >
            <img
              src={logo}
              alt="Milestone Fragrances"
              className="h-12 sm:h-16 w-auto mx-auto object-contain
              transition-transform duration-200 ease-in-out
              group-hover:rotate-[360deg]"
            />
          </button>

          <h1
            className="text-[#dfb76c] text-center
              text-2xl sm:text-3xl font-semibold
              tracking-wide whitespace-nowrap
              "
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Milestone{" "}
            <span className="text-white italic">
              Fragrance
            </span>
          </h1>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link);
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`transition-colors duration-200 relative py-1 focus:outline-none cursor-pointer ${isActive
                    ? 'text-[#dfb76c] font-semibold'
                    : 'text-stone-300 hover:text-[#dfb76c]'
                  }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#dfb76c] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-4 sm:gap-5 text-stone-200">
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="p-1.5 hover:text-[#dfb76c] transition-colors rounded-full focus:outline-none"
          >
            <Search className="w-5 h-5 stroke-[1.75]" />
          </button>

          <button
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Wishlist"
            className="p-1.5 hover:text-[#dfb76c] transition-colors relative rounded-full focus:outline-none"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#dfb76c] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
            className="p-1.5 hover:text-[#dfb76c] transition-colors relative rounded-full focus:outline-none"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute -top-1 -right-1.5 bg-[#dfb76c] text-black text-[10px] font-bold px-1 min-w-[17px] h-[17px] rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-stone-300 hover:text-[#dfb76c] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#12100d] border-b border-[#2b241c] px-6 py-5 space-y-3 transition-all animate-in fade-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link)}
              className={`block w-full text-left py-2 text-base transition-colors ${isLinkActive(link)
                  ? 'text-[#dfb76c] font-semibold pl-2 border-l-2 border-[#dfb76c]'
                  : 'text-stone-300 hover:text-white'
                }`}
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#dfb76c]" /> Account / Login
            </span>
            <span className="text-[#dfb76c]">Free delivery &gt; Rs. 5,000</span>
          </div>
        </div>
      )}
    </header>
  );
}

