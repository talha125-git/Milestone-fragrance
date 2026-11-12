import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Mail,
  Users,
  Sparkles,
} from 'lucide-react';
import { prodSignature } from '../../assets';
import { products as initialLocalProducts } from '../../data/products';

import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import OverviewTab from './OverviewTab';
import ProductsTab from './ProductsTab';
import OrdersTab from './OrdersTab';
import MessagesTab from './MessagesTab';
import NewsletterTab from './NewsletterTab';
import HeroTab from './frontend_setup/HeroTab';
import ProductModal from './ProductModal';
import DeleteModal from './DeleteModal';

export default function AdminDashboard({
  onLogout,
  productsList: initialProductsList,
  onProductsChange,
  heroSlides,
  onHeroSlidesChange,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve activeTab from URL pathname (e.g. /admin/frontend-setup/hero -> 'hero')
  const getTabFromPath = (pathname) => {
    const cleanPath = pathname.toLowerCase().replace(/\/+$/, '');
    if (
      cleanPath === '/admin/frontend-setup/hero' ||
      cleanPath === '/admin/frontend_setup/hero' ||
      cleanPath === '/admin/frontend-setup' ||
      cleanPath === '/admin/frontend_setup' ||
      cleanPath === '/admin/hero' ||
      cleanPath === '/admin/hero-banner'
    ) {
      return 'hero';
    }

    if (cleanPath === '/admin/products') return 'products';
    if (cleanPath === '/admin/orders') return 'orders';
    if (cleanPath === '/admin/messages' || cleanPath === '/admin/inquiries') return 'messages';
    if (cleanPath === '/admin/newsletter' || cleanPath === '/admin/subscribers') return 'newsletter';
    return 'overview';
  };

  const activeTab = getTabFromPath(location.pathname);

  // Navigate to appropriate URL path when a tab is requested
  const setActiveTab = (tabId) => {
    let targetPath = '/admin/overview';
    switch (tabId) {
      case 'overview':
        targetPath = '/admin/overview';
        break;
      case 'products':
        targetPath = '/admin/products';
        break;
      case 'orders':
        targetPath = '/admin/orders';
        break;
      case 'messages':
      case 'inquiries':
        targetPath = '/admin/messages';
        break;
      case 'newsletter':
      case 'subscribers':
        targetPath = '/admin/newsletter';
        break;
      case 'hero':
      case 'hero-banner':
      case 'frontend-setup/hero':
        targetPath = '/admin/frontend-setup/hero';
        break;
      default:
        targetPath = `/admin/${tabId}`;
    }
    navigate(targetPath);
  };

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
    isNewArrival: true,
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
            assetPath: json.assetPath || `public/productimages/${json.filename}`,
          }));
          setUploadedAssetPath(json.assetPath || `public/productimages/${json.filename}`);
          showToast(`Image stored in public/productimages (${json.filename})`);
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
          showToast(`Image stored in public/productimages (${bJson.filename})`);
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
        // Fallback
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
      isNewArrival: Boolean(product.isNewArrival),
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
    { id: 'overview', path: '/admin/overview', label: 'Dashboard Overview', icon: LayoutDashboard, badge: null },
    { id: 'products', path: '/admin/products', label: 'Fragrances Catalog', icon: Package, badge: productsList.length },
    { id: 'orders', path: '/admin/orders', label: 'Customer Orders', icon: ShoppingBag, badge: orders.length },
    { id: 'messages', path: '/admin/messages', label: 'Contact Inquiries', icon: Mail, badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} new` : null },
    { id: 'newsletter', path: '/admin/newsletter', label: 'VIP Subscribers', icon: Users, badge: subscribers.length },
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

      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navItems={navItems}
        onLogout={onLogout}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <AdminHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSidebarOpen={setSidebarOpen}
          loadAllRealData={loadAllRealData}
          isRefreshing={isRefreshing}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Dashboard Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'overview' && (
            <OverviewTab
              totalRevenue={totalRevenue}
              orders={orders}
              productsList={productsList}
              inStockCount={inStockCount}
              outOfStockCount={outOfStockCount}
              subscribers={subscribers}
              setActiveTab={setActiveTab}
              handleToggleStock={handleToggleStock}
            />
          )}

          {activeTab === 'products' && (
            <ProductsTab
              searchProductQuery={searchProductQuery}
              setSearchProductQuery={setSearchProductQuery}
              filterGender={filterGender}
              setFilterGender={setFilterGender}
              filteredProducts={filteredProducts}
              handleOpenAddModal={handleOpenAddModal}
              handleOpenEditModal={handleOpenEditModal}
              handleToggleStock={handleToggleStock}
              setDeleteCandidate={setDeleteCandidate}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              handleOrderStatusChange={handleOrderStatusChange}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesTab
              messages={messages}
              setMessages={setMessages}
              showToast={showToast}
            />
          )}

          {activeTab === 'newsletter' && (
            <NewsletterTab
              subscribers={subscribers}
              setSubscribers={setSubscribers}
              showToast={showToast}
            />
          )}

          {activeTab === 'hero' && (
            <HeroTab
              heroSlides={heroSlides}
              setHeroSlides={onHeroSlidesChange}
              productsList={productsList}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* 3. ADD / EDIT FRAGRANCE MODAL */}
      <ProductModal
        isOpen={isAddModalOpen || isEditModalOpen}
        isEdit={isEditModalOpen}
        editingProduct={editingProduct}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        formData={formData}
        setFormData={setFormData}
        onSubmit={isEditModalOpen ? handleSaveEditProduct : handleSaveAddProduct}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        selectedImageFile={selectedImageFile}
        setSelectedImageFile={setSelectedImageFile}
        isUploadingImage={isUploadingImage}
        uploadedAssetPath={uploadedAssetPath}
        setUploadedAssetPath={setUploadedAssetPath}
        handleImageFileChange={handleImageFileChange}
      />

      {/* 4. DELETE CONFIRMATION MODAL */}
      <DeleteModal
        candidate={deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

