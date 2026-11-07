import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import SearchModal from './components/SearchModal';

import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Unisex from './pages/Unisex';
import Collections from './pages/Collections';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import { products } from './data/products';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedProduct, setSelectedProduct] = useState(() => products[0]);
  const [selectedCollectionType, setSelectedCollectionType] = useState('all');
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('milestone_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('milestone_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('milestone_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('milestone_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          size: product.size || '50ml / 1.7 fl.oz',
          concentration: product.concentration || 'Eau De Parfum',
        },
      ];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to wishlist`);
    }
  };

  // Auto scroll to top on pathname change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleNavigate = (pathOrId) => {
    if (!pathOrId) return;
    let target = pathOrId;
    if (target === 'home') {
      target = '/';
    } else if (!target.startsWith('/')) {
      target = `/${target}`;
    }
    navigate(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (product) => {
    if (product && product.id) {
      setSelectedProduct(product);
      navigate(`/products/${product.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#0d0c0a] text-stone-200 font-sans flex flex-col relative selection:bg-[#dfb76c] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1713] border border-[#dfb76c] text-[#dfb76c] px-4 py-2.5 rounded-lg shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-[#dfb76c] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentPage={location.pathname}
        setCurrentPage={handleNavigate}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        wishlistCount={wishlist.length}
        setIsWishlistOpen={setIsWishlistOpen}
        setIsSearchOpen={setIsSearchOpen}
      />

      {/* Page Routing */}
      <div className={`flex-1 ${isHome ? '' : 'pt-24 sm:pt-28'}`}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map((w) => w.id)}
                onOpenQuickView={handleViewProduct}
                onNavigate={handleNavigate}
                onSelectGender={(g) => handleNavigate(g)}
                onSelectType={(t) => {
                  setSelectedCollectionType(t);
                  navigate(`/collections/${encodeURIComponent(t.toLowerCase())}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            }
          />

          <Route
            path="/men"
            element={
              <Men
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map((w) => w.id)}
                onOpenQuickView={handleViewProduct}
              />
            }
          />

          <Route
            path="/women"
            element={
              <Women
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map((w) => w.id)}
                onOpenQuickView={handleViewProduct}
              />
            }
          />

          <Route
            path="/unisex"
            element={
              <Unisex
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map((w) => w.id)}
                onOpenQuickView={handleViewProduct}
              />
            }
          />

          <Route
            path="/collections"
            element={
              <Collections
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map((w) => w.id)}
                onOpenQuickView={handleViewProduct}
                selectedType={selectedCollectionType}
                setSelectedType={setSelectedCollectionType}
              />
            }
          />

          <Route
            path="/collections/:type"
            element={
              <Collections
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlistIds={wishlist.map((w) => w.id)}
                onOpenQuickView={handleViewProduct}
                selectedType={selectedCollectionType}
                setSelectedType={setSelectedCollectionType}
              />
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProductDetail
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
                onSelectProduct={handleViewProduct}
                onNavigate={handleNavigate}
              />
            }
          />

          {/* Alias /product/:id */}
          <Route
            path="/product/:id"
            element={
              <ProductDetail
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
                onSelectProduct={handleViewProduct}
                onNavigate={handleNavigate}
              />
            }
          />

          <Route
            path="/about"
            element={<About onNavigate={handleNavigate} />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onSelectProduct={handleViewProduct}
      />

      {/* Slide-out Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(id) => {
          setWishlist((prev) => prev.filter((item) => item.id !== id));
        }}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleViewProduct}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenQuickView={handleViewProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
