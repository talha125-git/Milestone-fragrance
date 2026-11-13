import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  Banknote,
  Sparkles,
  Tag,
  Check,
  AlertCircle,
  Package,
} from 'lucide-react';

export default function Checkout({
  cart = [],
  onClearCart,
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess,
}) {
  const navigate = useNavigate();

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: 'Lahore',
    otherCity: '',
    postalCode: '',
    deliveryNotes: '',
    paymentMethod: 'Cash on Delivery',
  });

  // Voucher
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const isFreeShipping = subtotal >= 5000;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 200;
  const discountAmount = appliedCoupon ? Math.round(subtotal * appliedCoupon.discount) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const majorCities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Sialkot',
    'Gujranwala',
    'Quetta',
    'Hyderabad',
    'Abbottabad',
    'Other City',
  ];

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const clean = couponCode.trim().toUpperCase();

    if (clean === 'MILESTONE10') {
      setAppliedCoupon({ code: clean, discount: 0.1, label: '10% Atelier Welcome Discount' });
      setCouponCode('');
    } else if (clean === 'VIP20') {
      setAppliedCoupon({ code: clean, discount: 0.2, label: '20% VIP Connoisseur Discount' });
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try "MILESTONE10" for 10% off!');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Your shopping bag is empty. Please add a fragrance before checking out.');
      return;
    }

    if (!formData.firstName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Please complete all required shipping fields (*).');
      return;
    }

    setIsSubmitting(true);

    const resolvedCity = formData.city === 'Other City' ? (formData.otherCity || 'Pakistan') : formData.city;
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    const orderPayload = {
      customer: fullName,
      email: formData.email.trim() || 'customer@milestone.pk',
      phone: formData.phone.trim(),
      city: resolvedCity,
      address: `${formData.address.trim()}${formData.apartment ? ', ' + formData.apartment.trim() : ''}`,
      postalCode: formData.postalCode.trim(),
      notes: formData.deliveryNotes.trim(),
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size || '100ML',
        price: item.price,
        qty: item.quantity,
        image: item.image,
        concentration: item.concentration || 'Eau De Parfum',
      })),
      subtotal,
      shipping: shippingFee,
      discount: discountAmount,
      couponCode: appliedCoupon?.code || '',
      total: finalTotal,
      payment: formData.paymentMethod,
    };

    try {
      // 1. Post to backend API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      let savedOrder = null;
      if (res.ok) {
        const json = await res.json();
        savedOrder = json.data;
      } else {
        // Fallback local order structure
        savedOrder = {
          ...orderPayload,
          id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'Pending',
          date: 'Just now',
          createdAt: new Date().toISOString(),
        };
      }

      // 2. Also persist to localStorage for cross-tab sync with Admin
      try {
        const existingOrders = JSON.parse(localStorage.getItem('milestone_orders') || '[]');
        localStorage.setItem('milestone_orders', JSON.stringify([savedOrder, ...existingOrders]));
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }

      setCompletedOrder(savedOrder);
      setOrderComplete(true);
      if (onOrderSuccess) onOrderSuccess(savedOrder);
      if (onClearCart) onClearCart();
      window.scrollTo(0, 0);
    } catch (err) {
      console.warn('[Checkout submit error]:', err);
      // Offline fallback
      const offlineOrder = {
        ...orderPayload,
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Pending',
        date: 'Just now',
        createdAt: new Date().toISOString(),
      };
      setCompletedOrder(offlineOrder);
      setOrderComplete(true);
      if (onOrderSuccess) onOrderSuccess(offlineOrder);
      if (onClearCart) onClearCart();
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS / CONFIRMATION SCREEN
  if (orderComplete && completedOrder) {
    return (
      <div className="min-h-screen bg-[#0c0d0c] text-stone-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
          {/* Header Badge */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#dfb76c]/15 border border-[#dfb76c] rounded-full flex items-center justify-center mx-auto text-[#dfb76c] shadow-lg shadow-[#dfb76c]/10 animate-bounce">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#dfb76c] uppercase block">
              Order Confirmed & Received
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-white font-medium">
              Thank You For Your Order
            </h1>
            <p className="text-stone-400 text-sm max-w-lg mx-auto">
              Your artisanal perfume order has been received. Our master compounders are preparing your bottle with utmost precision.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#14120f] border border-[#262018] rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#241e17]">
              <div>
                <span className="text-xs text-stone-400 block mb-0.5">Order Reference</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#dfb76c] tracking-wider">
                  {completedOrder.id}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block mb-0.5">Estimated Delivery</span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                  2 - 4 Business Days (TCS Express)
                </span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Purchased Fragrances ({completedOrder.items?.length || 0})
              </h3>
              <div className="divide-y divide-[#201b15]">
                {completedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <div className="w-14 h-14 rounded-lg bg-[#1c1813] border border-[#2e261c] p-1 flex items-center justify-center flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-serif font-bold text-white">{item.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <span className="font-bold text-[#dfb76c] uppercase">{item.size}</span>
                          <span>•</span>
                          <span>Qty: {item.qty}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-white text-sm">
                      Rs. {((Number(item.price) || 0) * (item.qty || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#241e17] text-xs">
              <div className="bg-[#181511] p-4 rounded-lg border border-[#292218]">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block mb-1">
                  Delivery Destination
                </span>
                <p className="font-semibold text-white">{completedOrder.customer}</p>
                <p className="text-stone-300 mt-0.5">{completedOrder.address}</p>
                <p className="text-stone-400">{completedOrder.city}{completedOrder.postalCode ? ` - ${completedOrder.postalCode}` : ''}</p>
                <p className="text-[#dfb76c] font-medium mt-1">{completedOrder.phone}</p>
              </div>

              <div className="bg-[#181511] p-4 rounded-lg border border-[#292218]">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block mb-1">
                  Payment Summary
                </span>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-[#dfb76c]" />
                  <span>{completedOrder.payment}</span>
                </p>
                <div className="mt-2 space-y-1 text-stone-400">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white">Rs. {completedOrder.subtotal?.toLocaleString()}</span>
                  </div>
                  {completedOrder.discount > 0 && (
                    <div className="flex justify-between text-[#dfb76c]">
                      <span>Discount:</span>
                      <span>- Rs. {completedOrder.discount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="text-white">{completedOrder.shipping === 0 ? 'FREE' : `Rs. ${completedOrder.shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#dfb76c] pt-1 border-t border-stone-800">
                    <span>Total Amount Due:</span>
                    <span>Rs. {completedOrder.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/collections"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a] font-bold text-xs uppercase tracking-wider rounded-lg transition-all text-center shadow-md hover:shadow-lg"
            >
              Continue Exploring Fragrances
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#181511] hover:bg-[#201c17] text-stone-300 hover:text-white border border-[#2b241c] text-xs font-semibold rounded-lg transition-all text-center"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // REGULAR CHECKOUT VIEW
  return (
    <div className="min-h-screen bg-[#0c0d0c] text-stone-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#201c17]">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-[#dfb76c] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Fragrance Atelier</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
            <span className="text-stone-500">Cart</span>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <span className="text-[#dfb76c] font-bold">Checkout & Delivery</span>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <span className="text-stone-600">Confirmation</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-lg bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Empty Bag Fallback */}
        {cart.length === 0 ? (
          <div className="bg-[#14120f] border border-[#262018] rounded-xl p-12 text-center space-y-4 max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
            <h2 className="text-xl font-serif text-white font-medium">Your Shopping Bag is Empty</h2>
            <p className="text-xs text-stone-400">
              Discover our signature Extrait de Parfum collections and select your preferred bottle volume.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#dfb76c] hover:bg-[#caa053] text-[#0d0c0a] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Discover Fragrances
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer & Delivery Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact */}
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-5 sm:p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#241e17]">
                  <h2 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] border border-[#dfb76c]/40 text-xs font-mono font-bold flex items-center justify-center">
                      1
                    </span>
                    <span>Customer Contact Information</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hamza"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. hamza.tariq@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Required for courier dispatch and SMS tracking update.
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping & Delivery Address */}
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-5 sm:p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#241e17]">
                  <h2 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] border border-[#dfb76c]/40 text-xs font-mono font-bold flex items-center justify-center">
                      2
                    </span>
                    <span>Shipping Address (Across Pakistan)</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Street Address / House No. / Plaza *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House 42-B, Sector Z, Phase 5, DHA"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                        City *
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] cursor-pointer"
                      >
                        {majorCities.map((c) => (
                          <option key={c} value={c} className="bg-[#14120f] text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formData.city === 'Other City' ? (
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                          Specify Your City *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Bahawalpur, Mardan..."
                          value={formData.otherCity}
                          onChange={(e) => setFormData({ ...formData, otherCity: e.target.value })}
                          className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c]"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                          Postal / ZIP Code (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 54000"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] transition-colors"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                      Special Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please call before arriving or deliver after 2 PM."
                      value={formData.deliveryNotes}
                      onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                      className="w-full bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg p-3 focus:outline-none focus:border-[#dfb76c] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-5 sm:p-6 space-y-4 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-[#241e17]">
                  <h2 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#dfb76c]/15 text-[#dfb76c] border border-[#dfb76c]/40 text-xs font-mono font-bold flex items-center justify-center">
                      3
                    </span>
                    <span>Payment Selection</span>
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Cash on Delivery */}
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      formData.paymentMethod === 'Cash on Delivery'
                        ? 'bg-[#1b1712] border-[#dfb76c] ring-1 ring-[#dfb76c]/40'
                        : 'bg-[#161310] border-[#292218] hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#dfb76c]/15 text-[#dfb76c] flex items-center justify-center flex-shrink-0">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-white block">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[11px] text-stone-400 block mt-0.5">
                            Pay in cash when your fragrance parcel is delivered to your doorstep.
                          </span>
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-stone-500 flex items-center justify-center flex-shrink-0">
                        {formData.paymentMethod === 'Cash on Delivery' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#dfb76c]" />
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Direct Bank Transfer */}
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Direct Bank Transfer / Raast' })}
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      formData.paymentMethod === 'Direct Bank Transfer / Raast'
                        ? 'bg-[#1b1712] border-[#dfb76c] ring-1 ring-[#dfb76c]/40'
                        : 'bg-[#161310] border-[#292218] hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-white block">
                            Direct Bank Transfer / Raast
                          </span>
                          {/* <span className="text-[11px] text-stone-400 block mt-0.5">
                            Meezan Bank, HBL, Bank Alfalah, Raast & JazzCash instant transfer.
                          </span> */}
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-stone-500 flex items-center justify-center flex-shrink-0">
                        {formData.paymentMethod === 'Direct Bank Transfer / Raast' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#dfb76c]" />
                        )}
                      </div>
                    </div>

                    {formData.paymentMethod === 'Direct Bank Transfer / Raast' && (
                      <div className="mt-3.5 pt-3 border-t border-[#2e261c] text-[11px] text-stone-300 space-y-1.5 animate-in fade-in">
                        <p className="text-[#dfb76c] font-semibold">Bank Account Coordinates:</p>
                        <p>Bank: <strong className="text-white">Bank Alfalah</strong></p>
                        <p>Title: <strong className="text-white">Yaseen Ahmad</strong></p>
                        <p>IBAN / Account: <code className="text-[#dfb76c] font-mono font-bold bg-[#110e0b] px-1.5 py-0.5 rounded">58425002600961</code></p>
                        <p className="text-[10px] text-stone-400 italic">
                          Please WhatsApp transfer screenshot to +92 313 9197256 along with your order ID.
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Review */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#14120f] border border-[#262018] rounded-xl p-5 sm:p-6 space-y-5 shadow-2xl sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-[#241e17]">
                  <h3 className="font-serif text-base font-bold text-white">Order Summary</h3>
                  <span className="text-xs text-[#dfb76c] font-bold">
                    {cart.reduce((s, i) => s + (i.quantity || 1), 0)} Bottles
                  </span>
                </div>

                {/* Items in Cart */}
                <div className="max-h-64 overflow-y-auto divide-y divide-[#211c15] pr-1">
                  {cart.map((item) => {
                    const itemKey = item.cartKey || `${item.id}-${item.size || '100ml'}`;
                    return (
                      <div key={itemKey} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#FAF6F0] p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-serif font-bold text-white line-clamp-1">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                              <span className="px-1.5 py-0.2 bg-[#201b15] border border-stone-700 text-stone-200 font-bold rounded uppercase text-[10px]">
                                {item.size || '100ML'}
                              </span>
                              <span>•</span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            Rs. {((Number(item.price) || 0) * (item.quantity || 1)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Voucher / Coupon Code */}
                <div className="pt-2 border-t border-[#241e17]">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#dfb76c]/10 border border-[#dfb76c]/30 text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#dfb76c]" />
                        <span className="text-[#dfb76c] font-bold">{appliedCoupon.code}</span>
                        <span className="text-stone-300">({appliedCoupon.label})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-stone-400 hover:text-white text-xs underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon Code (e.g. MILESTONE10)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 bg-[#1b1713] border border-[#2d251c] text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#dfb76c] uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 bg-[#201b15] hover:bg-[#2e261c] text-stone-200 border border-stone-700 hover:border-[#dfb76c] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-amber-400 pl-1">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-3 border-t border-[#241e17] text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white font-medium">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-[#dfb76c]">
                      <span>Discount ({appliedCoupon.code}):</span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Courier Delivery:</span>
                    <span className={isFreeShipping ? 'text-emerald-400 font-bold' : 'text-white'}>
                      {isFreeShipping ? 'FREE (Orders > Rs. 5,000)' : `Rs. ${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#241e17]">
                    <span>Total Amount:</span>
                    <span className="text-lg text-[#dfb76c]">Rs. {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-gradient-to-r from-[#dfb76c] via-[#f3cf88] to-[#dfb76c] hover:brightness-110 active:scale-[0.99] text-[#0d0c0a] font-bold text-xs sm:text-sm uppercase tracking-wider py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 fill-current" />
                      <span>Place Order • Rs. {finalTotal.toLocaleString()}</span>
                    </>
                  )}
                </button>

                {/* Reassurance Features */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#241e17] text-[11px] text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                    <span>Nationwide Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c] flex-shrink-0" />
                    <span>100% Extrait Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

