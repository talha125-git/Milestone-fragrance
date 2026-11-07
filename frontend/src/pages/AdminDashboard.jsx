import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Mail,
  Users,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  X,
  Sparkles,
  Menu,
  RefreshCw,
  Eye,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Check,
  Phone,
  MapPin,
  Calendar,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { logo, prodSignature, prodBelieve, prodGhanam, prodProfessor } from '../assets';
import { products as initialLocalProducts } from '../data/products';

export default function AdminDashboard({ onLogout, productsList: initialProductsList, onProductsChange }) {
  const navigate = useNavigate();

  // Active Navigation Tab: 'overview' | 'products' | 'orders' | 'messages' | 'newsletter'
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real Data States
  const [productsList, setProductsList] = useState(() => {
    if (initialProductsList && initialProductsList.length > 0) {
      return initialProductsList;
    }
    try {
      const saved = localStorage.getItem('milestone_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialLocalProducts;
  });

  // Helper to sync changes with parent and localStorage
  const updateAndBroadcastProducts = (newList) => {
    setProductsList(newList);
    if (onProductsChange) onProductsChange(newList);
    try {
      localStorage.setItem('milestone_products', JSON.stringify(newList));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  useEffect(() => {
    if (initialProductsList && initialProductsList.length > 0) {
      setProductsList(initialProductsList);
    }
  }, [initialProductsList]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // Product Filtering & Search
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [filterGender, setFilterGender] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  // Form Data
  const defaultForm = {
    name: '',
    subtitle: '',
    tagline: '',
    price: 6499,
    originalPrice: 7999,
    gender: 'Unisex',
    type: 'Woody',
    concentration: 'Eau De Parfum',
    size: '50ml / 1.7 fl.oz',
    description: '',
    topNotes: 'Italian Bergamot, Cardamom',
    heartNotes: 'Smoky Cedarwood, Golden Ambergris',
    baseNotes: 'Rich Agarwood (Oud), Bourbon Vanilla',
    inStock: true,
    bestSeller: false,
    image: prodSignature,
    assetPath: '',
  };
  const [formData, setFormData] = useState(defaultForm);

  // Image Upload State
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedAssetPath, setUploadedAssetPath] = useState('');

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle Image File Selection & Immediate Storage in assets/productimages
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    // Instant local preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setFormData((prev) => ({ ...prev, image: ev.target.result }));
    };
    reader.readAsDataURL(file);

    // Upload to backend to store directly in assets/productimages
    setIsUploadingImage(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          setFormData((prev) => ({
            ...prev,
            image: json.url,
            assetPath: json.assetPath || `assets/productimages/${json.filename}`,
          }));
          setUploadedAssetPath(json.assetPath || `assets/productimages/${json.filename}`);
          showToast(`Image stored in assets/productimages (${json.filename})`);
        }
      } else {
        // Fallback: send as base64 to base64 upload endpoint
        const base64Content = await new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(file);
        });

        const bRes = await fetch('/api/upload/base64', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64Data: base64Content,
          }),
        });

        if (bRes.ok) {
          const bJson = await bRes.json();
          setFormData((prev) => ({
            ...prev,
            image: bJson.url,
            assetPath: bJson.assetPath,
          }));
          setUploadedAssetPath(bJson.assetPath);
          showToast(`Image stored in assets/productimages (${bJson.filename})`);
        }
      }
    } catch (err) {
      console.warn('[Upload error]:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Fetch all real details from backend API
  const loadAllRealData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch Real Products
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prodJson = await prodRes.json();
          if (prodJson.data && Array.isArray(prodJson.data) && prodJson.data.length > 0) {
            const enriched = prodJson.data.map((p) => {
              const localMatch = initialLocalProducts.find((lp) => lp.id === p.id);
              return {
                ...p,
                image: (p.image && !p.image.startsWith('data:') && !p.image.startsWith('/productimages') && localMatch)
                  ? localMatch.image
                  : (p.image || localMatch?.image || prodSignature),
              };
            });
            updateAndBroadcastProducts(enriched);
          }
        }
      } catch {
        // Fallback
      }

      // 2. Fetch Real Orders
      try {
        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ordJson = await ordRes.json();
          if (ordJson.data && Array.isArray(ordJson.data)) {
            setOrders(ordJson.data);
          }
        }
      } catch {
        // Fallback default realistic orders
      }

      // 3. Fetch Real Newsletter Subscribers
      try {
        const subRes = await fetch('/api/newsletter');
        if (subRes.ok) {
          const subJson = await subRes.json();
          if (subJson.data && Array.isArray(subJson.data)) {
            setSubscribers(subJson.data);
          }
        }
      } catch {
        // Fallback
      }

      // 4. Fetch Real Contact Messages
      try {
        const msgRes = await fetch('/api/contact');
        if (msgRes.ok) {
          const msgJson = await msgRes.json();
          if (msgJson.data && Array.isArray(msgJson.data)) {
            setMessages(msgJson.data);
          }
        }
      } catch {
        // Fallback
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllRealData();
  }, []);

  // Handle Logout
  const handleLogoutClick = () => {
    localStorage.removeItem('milestone_admin_auth');
    localStorage.removeItem('milestone_admin_user');
    sessionStorage.removeItem('milestone_admin_auth');
    sessionStorage.removeItem('milestone_admin_user');
    if (onLogout) onLogout();
    navigate('/login', { replace: true });
  };

  // Toggle Product Stock Status
  const handleToggleStock = (product) => {
    const newStatus = !product.inStock;
    const updated = productsList.map((p) => (p.id === product.id ? { ...p, inStock: newStatus } : p));
    updateAndBroadcastProducts(updated);

    fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: newStatus }),
    }).catch(() => {});

    showToast(`Stock updated: ${product.name} is now ${newStatus ? 'In Stock' : 'Out of Stock'}`);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData(defaultForm);
    setSelectedImageFile(null);
    setImagePreview(defaultForm.image);
    setUploadedAssetPath('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      subtitle: product.subtitle || '',
      tagline: product.tagline || '',
      price: product.price || 6499,
      originalPrice: product.originalPrice || 7999,
      gender: product.gender || 'Unisex',
      type: product.type || 'Woody',
      concentration: product.concentration || 'Eau De Parfum',
      size: product.size || '50ml / 1.7 fl.oz',
      description: product.description || '',
      topNotes: Array.isArray(product.topNotes) ? product.topNotes.join(', ') : '',
      heartNotes: Array.isArray(product.heartNotes) ? product.heartNotes.join(', ') : '',
      baseNotes: Array.isArray(product.baseNotes) ? product.baseNotes.join(', ') : '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      bestSeller: Boolean(product.bestSeller),
      image: product.image || prodSignature,
      assetPath: product.assetPath || '',
    });
    setSelectedImageFile(null);
    setImagePreview(product.image || prodSignature);
    setUploadedAssetPath(product.assetPath || '');
    setIsEditModalOpen(true);
  };

  // Save New Product
  const handleSaveAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newId =
      formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
      `prod-${Date.now()}`;

    const newProduct = {
      ...formData,
      id: newId,
      rating: 5,
      reviewsCount: 1,
      topNotes: formData.topNotes.split(',').map((s) => s.trim()).filter(Boolean),
      heartNotes: formData.heartNotes.split(',').map((s) => s.trim()).filter(Boolean),
      baseNotes: formData.baseNotes.split(',').map((s) => s.trim()).filter(Boolean),
    };

    const updated = [newProduct, ...productsList];
    updateAndBroadcastProducts(updated);
    setIsAddModalOpen(false);

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    }).catch(() => {});

    showToast(`Fragrance "${newProduct.name}" added to catalog`);
  };

  // Save Edit Product
  const handleSaveEditProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = {
      ...editingProduct,
      ...formData,
      topNotes:
        typeof formData.topNotes === 'string'
          ? formData.topNotes.split(',').map((s) => s.trim()).filter(Boolean)
          : formData.topNotes,
      heartNotes:
        typeof formData.heartNotes === 'string'
          ? formData.heartNotes.split(',').map((s) => s.trim()).filter(Boolean)
          : formData.heartNotes,
      baseNotes:
        typeof formData.baseNotes === 'string'
          ? formData.baseNotes.split(',').map((s) => s.trim()).filter(Boolean)
          : formData.baseNotes,
    };

    const updatedList = productsList.map((p) => (p.id === editingProduct.id ? updated : p));
    updateAndBroadcastProducts(updatedList);
    setIsEditModalOpen(false);
    setEditingProduct(null);

    fetch(`/api/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});

    showToast(`Updated "${updated.name}"`);
  };

  // Delete Product
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;

    const updatedList = productsList.filter((p) => p.id !== deleteCandidate.id);
    updateAndBroadcastProducts(updatedList);
    const name = deleteCandidate.name;
    setDeleteCandidate(null);

    fetch(`/api/products/${deleteCandidate.id}`, {
      method: 'DELETE',
    }).catch(() => {});

    showToast(`Fragrance "${name}" removed from catalog`, 'info');
  };

  // Update Order Status
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});

    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  // Filtered Products
  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchProductQuery.toLowerCase());
    const matchesGender =
      filterGender === 'all' || p.gender.toLowerCase() === filterGender.toLowerCase();
    return matchesSearch && matchesGender;
  });

  // Calculate Real Revenue & Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const inStockCount = productsList.filter((p) => p.inStock).length;
  const outOfStockCount = productsList.length - inStockCount;
  const unreadMessagesCount = messages.filter((m) => !m.replied).length;

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { id: 'products', label: 'Fragrances Catalog', icon: Package, badge: productsList.length },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, badge: orders.length },
    { id: 'messages', label: 'Contact Inquiries', icon: Mail, badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} new` : null },
    { id: 'newsletter', label: 'VIP Subscribers', icon: Users, badge: subscribers.length },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-stone-800 flex font-sans selection:bg-[#dfb76c] selection:text-black">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2.5 border animate-in fade-in slide-in-from-bottom duration-200 ${
            toast.type === 'info'
              ? 'bg-stone-900 border-amber-500 text-amber-300'
              : 'bg-stone-900 border-[#dfb76c] text-[#dfb76c]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#dfb76c]" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR NAVIGATION (Blackish Luxury Theme)        */}
      {/* ======================================================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#14120f] border-r border-[#262019] text-stone-200 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header: Brand */}
        <div>
          <div className="p-5 border-b border-[#241e17] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Milestone Fragrances" className="h-8 w-auto object-contain" />
              <div>
                <span className="text-[10px] font-bold text-[#dfb76c] tracking-[0.2em] uppercase block">
                  Admin Console
                </span>
                <span className="text-xs font-serif font-bold text-white">
                  Milestone Fragrance
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-stone-400 hover:text-white rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Management
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#dfb76c] text-[#0d0c0a] font-bold shadow-md shadow-[#dfb76c]/15'
                      : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0d0c0a]' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-black/20 text-black'
                          : 'bg-white/10 text-stone-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer: Profile & Store link */}
        <div className="p-3 border-t border-[#241e17] space-y-2">
          {/* Quick link to live store */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-[#dfb76c] hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              <span>Live Storefront</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {/* Admin User Card */}
          <div className="p-2.5 rounded-xl bg-[#1b1713] border border-[#2c241b] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#dfb76c] text-[#0d0c0a] font-bold text-xs flex items-center justify-center uppercase shadow-xs">
                A
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">admin</div>
                <div className="text-[10px] text-[#dfb76c]">Super Administrator</div>
              </div>
            </div>

            <button
              onClick={handleLogoutClick}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA (Whitish Theme)                      */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
                {activeTab === 'overview' && 'Executive Overview'}
                {activeTab === 'products' && 'Fragrance Inventory & Catalog'}
                {activeTab === 'orders' && 'Customer Orders & Shipments'}
                {activeTab === 'messages' && 'Inquiries & Customer Care'}
                {activeTab === 'newsletter' && 'VIP Newsletter Subscribers'}
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Milestone Fragrance official administrative dashboard.
              </p>
            </div>
          </div>

          {/* Right Header CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={loadAllRealData}
              disabled={isRefreshing}
              title="Refresh Real Data"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#b38531]' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Fragrance</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Stat Cards Grid (Pure White on Off-White) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Real Revenue */}
                <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Total Store Revenue
                    </span>
                    <div className="p-2 bg-amber-50 text-[#b38531] rounded-lg">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
                    Rs. {totalRevenue.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Real-time from {orders.length} active orders</span>
                  </div>
                </div>

                {/* 2. Real Orders */}
                <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Customer Orders
                    </span>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
                    {orders.length} Orders
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                    <span>
                      {orders.filter((o) => o.status === 'Delivered').length} Delivered •{' '}
                      {orders.filter((o) => o.status === 'Processing' || o.status === 'Shipped').length} In Transit
                    </span>
                  </div>
                </div>

                {/* 3. Real Fragrance Catalog */}
                <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Fragrance Catalog
                    </span>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
                    {productsList.length} Perfumes
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium">
                    <span className="text-emerald-600 font-semibold">{inStockCount} In Stock</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-rose-600 font-semibold">{outOfStockCount} Out of Stock</span>
                  </div>
                </div>

                {/* 4. Real Subscribers */}
                <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Newsletter VIPs
                    </span>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
                    {subscribers.length} Members
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-purple-700 font-medium">
                    <span>100% Verified Subscribers</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Recent Orders & Catalog Highlights */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Orders List */}
                <div className="lg:col-span-8 bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-base font-bold text-stone-900">
                        Recent Store Orders
                      </h3>
                      <p className="text-xs text-stone-500">
                        Live orders placed through the online storefront.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#b38531] font-semibold hover:underline cursor-pointer"
                    >
                      View All ({orders.length}) &rarr;
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-100 text-stone-400 uppercase text-[10px] tracking-wider font-semibold">
                          <th className="pb-3">Order ID</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Fragrance Items</th>
                          <th className="pb-3">Total Amount</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {orders.slice(0, 4).map((o) => (
                          <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-3.5 font-bold text-[#b38531]">{o.id}</td>
                            <td className="py-3.5">
                              <div className="font-semibold text-stone-900">{o.customer}</div>
                              <div className="text-[10px] text-stone-500">{o.city}</div>
                            </td>
                            <td className="py-3.5 text-stone-600">
                              {o.items.map((it, i) => (
                                <span key={i} className="inline-block mr-2">
                                  {it.qty}x {it.name}
                                </span>
                              ))}
                            </td>
                            <td className="py-3.5 font-bold text-stone-900">
                              Rs. {Number(o.total).toLocaleString()}
                            </td>
                            <td className="py-3.5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  o.status === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : o.status === 'Shipped'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : o.status === 'Processing'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Real Catalog Status */}
                <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
                      Live Catalog Status
                    </h3>
                    <p className="text-xs text-stone-500 mb-4">
                      Current perfume stock levels in production.
                    </p>

                    <div className="space-y-3">
                      {productsList.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-stone-100 bg-stone-50/60"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-white border border-stone-200 rounded p-0.5 flex items-center justify-center">
                              <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                            </div>
                            <div>
                              <div className="font-serif text-xs font-bold text-stone-900">{p.name}</div>
                              <div className="text-[10px] text-stone-500">Rs. {p.price.toLocaleString()}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleStock(p)}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors cursor-pointer ${
                              p.inStock
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>Manage all {productsList.length} items</span>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-[#b38531] font-semibold hover:underline cursor-pointer"
                    >
                      Open Catalog &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Controls bar */}
              <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search fragrance by name, notes or family..."
                      value={searchProductQuery}
                      onChange={(e) => setSearchProductQuery(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg pl-9 pr-3 py-2.5 placeholder-stone-400 focus:outline-none focus:border-[#b38531] focus:bg-white"
                    />
                  </div>

                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="bg-stone-50 border border-stone-200 text-stone-700 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#b38531] cursor-pointer"
                  >
                    <option value="all">All Genders</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Fragrance</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                        <th className="py-3.5 px-4">Fragrance Profile</th>
                        <th className="py-3.5 px-4">Category & Notes</th>
                        <th className="py-3.5 px-4">Retail Price</th>
                        <th className="py-3.5 px-4">Inventory Status</th>
                        <th className="py-3.5 px-4">Rating</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-stone-50 border border-stone-200 p-1 flex-shrink-0 flex items-center justify-center">
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                              </div>
                              <div>
                                <div className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5">
                                  <span>{p.name}</span>
                                  {p.bestSeller && (
                                    <span className="bg-[#b38531] text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                      Bestseller
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-stone-500 line-clamp-1">{p.tagline}</div>
                                <div className="text-[10px] font-mono text-[#b38531]">/products/{p.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-stone-900">{p.gender}</span>
                            <span className="text-stone-400"> • </span>
                            <span className="text-stone-600">{p.type}</span>
                            <div className="text-[10px] text-stone-500 line-clamp-1">
                              {Array.isArray(p.topNotes) ? p.topNotes.slice(0, 2).join(', ') : 'Citrus, Spices'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900 text-sm">
                              Rs. {Number(p.price).toLocaleString()}
                            </div>
                            {p.originalPrice > p.price && (
                              <div className="text-[10px] text-stone-400 line-through">
                                Rs. {Number(p.originalPrice).toLocaleString()}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                p.inStock
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 font-bold text-amber-600">
                              <span>★ {p.rating || 5}.0</span>
                              <span className="text-[10px] text-stone-400 font-normal">({p.reviewsCount || 100})</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                title="Edit Product"
                                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteCandidate(p)}
                                title="Delete Product"
                                className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      All Customer Orders ({orders.length})
                    </h3>
                    <p className="text-xs text-stone-500">
                      Real-time order entries with customer contact details and delivery tracking.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                        <th className="py-3.5 px-4">Order ID & Date</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Fragrance Items</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Payment Method</th>
                        <th className="py-3.5 px-4">Order Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#b38531]">{o.id}</div>
                            <div className="text-[10px] text-stone-400">{o.date}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{o.customer}</div>
                            <div className="text-[11px] text-stone-500">{o.email}</div>
                            <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-stone-400" />
                              <span>{o.city}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="font-medium text-stone-800">
                                {it.qty}x {it.name} <span className="text-[11px] text-stone-400">({it.size})</span>
                              </div>
                            ))}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900 text-sm">
                              Rs. {Number(o.total).toLocaleString()}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-stone-600 font-medium">{o.payment}</td>

                          <td className="py-3.5 px-4">
                            <select
                              value={o.status}
                              onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                              className="bg-stone-50 border border-stone-300 text-stone-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#b38531] cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT INQUIRIES */}
          {activeTab === 'messages' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-xs">
                <h3 className="font-serif text-base font-bold text-stone-900 mb-1">
                  Customer Inquiries & Messages ({messages.length})
                </h3>
                <p className="text-xs text-stone-500 mb-5">
                  Submitted through the live Contact Us page.
                </p>

                <div className="space-y-3.5">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-stone-900 text-sm">{m.name}</span>
                          <span className="text-xs text-stone-500 ml-2">&lt;{m.email}&gt;</span>
                          {m.phone && <span className="text-xs text-stone-500 ml-2">Phone: {m.phone}</span>}
                        </div>
                        <span className="text-[11px] text-stone-400">
                          {m.receivedAt ? new Date(m.receivedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-[#b38531]">{m.subject}</div>
                      <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-lg border border-stone-200/60">
                        "{m.message}"
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-stone-200/60">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            m.replied
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {m.replied ? 'Replied' : 'Pending Response'}
                        </span>

                        <button
                          onClick={() => {
                            setMessages((prev) =>
                              prev.map((item) =>
                                item.id === m.id ? { ...item, replied: !item.replied } : item
                              )
                            );
                            fetch(`/api/contact/${m.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ replied: !m.replied }),
                            }).catch(() => {});
                            showToast('Message status updated');
                          }}
                          className="text-xs text-[#b38531] font-semibold hover:underline cursor-pointer"
                        >
                          {m.replied ? 'Mark as Unread' : 'Mark as Replied'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'newsletter' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-stone-900">
                      VIP Newsletter Subscribers ({subscribers.length})
                    </h3>
                    <p className="text-xs text-stone-500">
                      Real customer emails captured from the footer and newsletter sections.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px] font-semibold">
                        <th className="py-3.5 px-4">Subscriber Email</th>
                        <th className="py-3.5 px-4">Join Date</th>
                        <th className="py-3.5 px-4">Subscription Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {subscribers.map((s, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-stone-900">{s.email}</td>
                          <td className="py-3.5 px-4 text-stone-500">{s.date}</td>
                          <td className="py-3.5 px-4">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {s.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSubscribers((prev) => prev.filter((item) => item.email !== s.email));
                                fetch(`/api/newsletter/${encodeURIComponent(s.email)}`, {
                                  method: 'DELETE',
                                }).catch(() => {});
                                showToast(`Removed subscriber: ${s.email}`);
                              }}
                              className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                              title="Remove Subscriber"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. ADD / EDIT FRAGRANCE MODAL (Light Luxury Theme)        */}
      {/* ======================================================== */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 text-stone-900 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">
                    {isEditModalOpen ? `Edit Fragrance: ${editingProduct?.name}` : 'Add New Fragrance to Catalog'}
                  </h3>
                  <p className="text-xs text-stone-500">Configure notes, pricing, volume and stock details.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={isEditModalOpen ? handleSaveEditProduct : handleSaveAddProduct} className="space-y-4">
                {/* Product Image Upload Section (Stored in assets/productimages) */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#b38531]" />
                      <span>Fragrance Bottle Image *</span>
                    </label>
                    <span className="text-[10px] text-stone-500 font-medium">
                      Stored in: <code className="text-[#b38531] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-stone-200">assets/productimages/</code>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Live Image Preview Stage */}
                    <div className="relative w-28 h-28 rounded-xl bg-white border border-stone-200 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-xs group">
                      <img
                        src={imagePreview || formData.image || prodSignature}
                        alt="Fragrance Preview"
                        className="w-full h-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-105"
                      />
                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-[10px] gap-1">
                          <RefreshCw className="w-5 h-5 animate-spin text-[#dfb76c]" />
                          <span>Saving...</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls & Details */}
                    <div className="flex-1 w-full space-y-2 text-left">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <label
                          htmlFor="fragrance-image-file"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#b38531] hover:bg-[#966d21] text-white text-xs font-semibold cursor-pointer shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{selectedImageFile ? 'Change Image File' : 'Upload Image File'}</span>
                        </label>
                        <input
                          id="fragrance-image-file"
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />

                        {uploadedAssetPath ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Saved in {uploadedAssetPath}</span>
                          </span>
                        ) : selectedImageFile ? (
                          <span className="text-xs text-stone-600 font-medium truncate max-w-[200px]">
                            {selectedImageFile.name}
                          </span>
                        ) : null}
                      </div>

                      <p className="text-[11px] text-stone-500 leading-snug">
                        Choose any perfume image from your computer (PNG, JPG, WEBP). It will be saved into <strong className="text-stone-700 font-semibold">assets/productimages/</strong> and rendered on all product pages.
                      </p>

                      {/* Quick Select Milestone Bottle Presets */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-stone-400 font-bold uppercase">Or Choose Preset:</span>
                        {[
                          { label: 'Ghanam', img: prodGhanam },
                          { label: 'Believe', img: prodBelieve },
                          { label: 'Signature', img: prodSignature },
                          { label: 'Professor', img: prodProfessor },
                        ].map((pr) => (
                          <button
                            key={pr.label}
                            type="button"
                            onClick={() => {
                              setImagePreview(pr.img);
                              setFormData((f) => ({ ...f, image: pr.img, assetPath: `assets/prod_${pr.label.toLowerCase()}.png` }));
                              setSelectedImageFile(null);
                              setUploadedAssetPath(`assets/prod_${pr.label.toLowerCase()}.png`);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded border border-stone-200 bg-white hover:border-[#b38531] text-stone-700 hover:text-[#b38531] transition-colors cursor-pointer"
                          >
                            {pr.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Perfume Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Reserve"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Subtitle / Edition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. الغنام Edition"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Retail Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Original / Before-Discount Price (Rs.)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Target Audience
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] cursor-pointer"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Fragrance Family
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] cursor-pointer"
                    >
                      <option value="Woody">Woody</option>
                      <option value="Fresh">Fresh</option>
                      <option value="Citrus">Citrus</option>
                      <option value="Floral">Floral</option>
                      <option value="Sweet">Sweet</option>
                      <option value="Fruity">Fruity</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A rich oriental scent with velvety saffron."
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Top Notes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.topNotes}
                    onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Heart Notes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.heartNotes}
                    onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Base Notes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.baseNotes}
                    onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#b38531] focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="rounded border-stone-300 text-[#b38531] focus:ring-0 cursor-pointer"
                    />
                    <span>Available In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bestSeller}
                      onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                      className="rounded border-stone-300 text-[#b38531] focus:ring-0 cursor-pointer"
                    />
                    <span>Mark as Bestseller</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#b38531] hover:bg-[#966d21] text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    {isEditModalOpen ? 'Save Changes' : 'Add to Catalog'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. DELETE CONFIRMATION MODAL                             */}
      {/* ======================================================== */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div onClick={() => setDeleteCandidate(null)} className="fixed inset-0 bg-black/50 backdrop-blur-xs" />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 text-stone-900 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 mx-auto border border-red-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 text-center mb-2">
                Delete "{deleteCandidate.name}"?
              </h3>
              <p className="text-xs text-stone-500 text-center mb-6">
                Are you sure you want to remove this perfume from the store catalog? This will unlist it from the storefront.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteCandidate(null)}
                  className="px-4 py-2.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
