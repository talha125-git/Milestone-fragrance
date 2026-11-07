import React from 'react';
import Hero from '../components/Hero';
import GenderBar from '../components/GenderBar';
import FragranceTypes from '../components/FragranceTypes';
import BestSellers from '../components/BestSellers';
import FeaturedFragrance from '../components/FeaturedFragrance';
import OurStory from '../components/OurStory';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import { products as defaultProducts } from '../data/products';

export default function Home({
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onOpenQuickView,
  onNavigate,
  onSelectGender,
  onSelectType,
  products: passedProducts,
  heroSlides,
}) {
  const productList = (passedProducts && passedProducts.length > 0) ? passedProducts : defaultProducts;

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <Hero
        slides={heroSlides}
        onShopNow={(productId) => {
          if (productId && onOpenQuickView) {
            const match = productList.find((p) => p.id === productId);
            if (match) {
              onOpenQuickView(match);
              return;
            }
          }
          onNavigate('collections');
        }}
      />

      {/* 2. Men, Women, Unisex Category Bar */}
      <GenderBar
        onSelectGender={(genderId) => onSelectGender(genderId)}
      />

      {/* 3. Explore By Fragrance Type */}
      <FragranceTypes
        onSelectType={(typeId) => onSelectType(typeId)}
      />

      {/* 4. Best Sellers: Most Loved Fragrances */}
      <BestSellers
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistIds={wishlistIds}
        onOpenQuickView={onOpenQuickView}
        onViewAll={() => onNavigate('collections')}
        products={productList}
      />

      {/* 5. Featured Fragrance: Professor */}
      <FeaturedFragrance
        onShopProfessor={() => {
          if (onOpenQuickView) {
            const professor = productList.find((p) => p.id === 'professor');
            if (professor) {
              onOpenQuickView(professor);
              return;
            }
          }
          onNavigate('men');
        }}
      />

      {/* 6. Our Story: More Than Just a Fragrance */}
      <OurStory
        onLearnMore={() => onNavigate('about')}
      />

      {/* 7. Testimonials: What Our Customers Say */}
      <Testimonials />

      {/* 8. Stay Updated: Join Our Newsletter */}
      <Newsletter />
    </main>
  );
}

