import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSelectProduct,
}) {
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 5000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 250;
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'MILESTONE10') {
      setAppliedDiscount(0.1);
    } else {
      alert('Invalid coupon code. Try "MILESTONE10" for 10% off!');
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: 'Valued Customer',
          email: 'customer@milestone.pk',
          phone: '+92 300 1234567',
          city: 'Lahore, Pakistan',
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            qty: item.quantity,
            size: item.size || '50ml',
            price: item.price,
          })),
          total: finalTotal,
          payment: 'Cash on Delivery',
        }),
      });
    } catch {
      // Offline fallback
    }

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#12100e] text-stone-200 border-l border-[#241e17] flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#241e17] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#dfb76c]" />
              <h2 className="text-base font-semibold text-white tracking-wide">
                Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3.5 bg-[#181410] border-b border-[#241e17] text-xs">
            {isFreeShipping ? (
              <div className="text-[#dfb76c] font-medium flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>You qualify for <strong>FREE DELIVERY</strong>!</span>
              </div>
            ) : (
              <div>
                <p className="text-stone-300 mb-1.5">
                  Add <span className="text-[#dfb76c] font-semibold">Rs. {remainingForFreeShipping.toLocaleString()}</span> more for <span className="text-[#dfb76c] font-semibold">FREE DELIVERY</span>!
                </p>
                <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#dfb76c] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderComplete ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#dfb76c]/20 text-[#dfb76c] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif text-white">Order Confirmed!</h3>
                <p className="text-stone-400 text-xs max-w-xs mx-auto">
                  Thank you for shopping with Milestone Fragrances. A confirmation email and tracking link have been dispatched.
                </p>
                <button
                  onClick={() => {
                    setOrderComplete(false);
                    onClose();
                  }}
                  className="bg-[#dfb76c] text-black font-semibold text-xs px-6 py-2.5 rounded-md hover:bg-[#caa053] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
                <p className="text-stone-400 text-sm">Your cart is currently empty.</p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs text-[#dfb76c] hover:underline font-medium"
                >
                  Discover Fragrances →
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartKey || `${item.id}-${item.size || '100ml'}`}
                  className="flex gap-3.5 p-3 rounded-lg bg-[#181410] border border-[#2b2319]"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => {
                      if (onSelectProduct) {
                        onSelectProduct({ id: item.id });
                        onClose();
                      }
                    }}
                    className="w-20 h-20 bg-[#FAF6F0] rounded overflow-hidden flex-shrink-0 flex items-center justify-center p-1 cursor-pointer group/thumb"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain transition-transform group-hover/thumb:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            if (onSelectProduct) {
                              onSelectProduct({ id: item.id });
                              onClose();
                            }
                          }}
                          className="text-sm font-semibold text-white font-serif hover:text-[#dfb76c] transition-colors cursor-pointer"
                        >
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.cartKey || item.id)}
                          aria-label="Remove item"
                          className="text-stone-500 hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-stone-200 uppercase">{item.size || '100ML'}</span>
                        <span>•</span>
                        <span>{item.concentration || 'Eau De Parfum'}</span>
                      </p>
                      <p className="text-xs font-semibold text-[#dfb76c] mt-0.5">
                        Rs. {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity modifier */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center border border-stone-700 rounded bg-[#100e0c]">
                        <button
                          onClick={() => onUpdateQuantity(item.cartKey || item.id, item.quantity - 1)}
                          className="p-1 hover:text-[#dfb76c] text-stone-400 focus:outline-none cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartKey || item.id, item.quantity + 1)}
                          className="p-1 hover:text-[#dfb76c] text-stone-400 focus:outline-none cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs text-stone-400">
                        Total: Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Checkout summary */}
          {cart.length > 0 && !orderComplete && (
            <div className="p-5 border-t border-[#241e17] bg-[#161310] space-y-3.5">
              {/* Coupon input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. MILESTONE10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="flex-1 bg-[#100e0c] border border-stone-800 text-xs px-3 py-2 rounded focus:border-[#dfb76c] focus:outline-none text-white uppercase placeholder-stone-600"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-3.5 py-2 rounded font-medium transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-400 pt-1 border-t border-stone-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#dfb76c]">
                    <span>Discount (10%)</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={isFreeShipping ? 'text-[#dfb76c] font-medium' : 'text-white'}>
                    {isFreeShipping ? 'FREE' : `Rs. ${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-stone-800">
                  <span>Estimated Total</span>
                  <span className="text-[#dfb76c] font-bold">Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a] font-semibold text-xs sm:text-sm py-3 rounded-md transition-colors flex items-center justify-center gap-2 focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

