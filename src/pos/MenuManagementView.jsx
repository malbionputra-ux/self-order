import React, { useState } from 'react';
import { Utensils, Plus, Edit2, CheckCircle2, XCircle, Search, Sparkles, Filter, Save, X, ToggleLeft, ToggleRight, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

export default function MenuManagementView({
  menus,
  categories,
  onToggleAvailability,
  onUpdatePrice,
  onAddNewMenu,
  onClose
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingPriceMenu, setEditingPriceMenu] = useState(null);
  const [newPriceInput, setNewPriceInput] = useState('');

  // Add New Menu Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    category_slug: 'signature-coffee',
    description: '',
    price: '',
    image: '',
    is_beverage: true,
    temp_options: 'both',
    is_milk_based: true,
    is_bestseller: false
  });

  const filteredMenus = menus.filter(menu => {
    const matchesCat = selectedCategory === 'all' || menu.category_slug === selectedCategory;
    const matchesSearch = !searchQuery ||
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSavePrice = (e) => {
    e.preventDefault();
    if (!editingPriceMenu) return;
    const parsedPrice = parseInt(newPriceInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(parsedPrice) && parsedPrice >= 0) {
      onUpdatePrice(editingPriceMenu.id, parsedPrice);
    }
    setEditingPriceMenu(null);
  };

  const handleCreateMenuSubmit = (e) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.price) return;
    
    const catObj = categories.find(c => c.slug === newItemData.category_slug) || categories[0];
    onAddNewMenu({
      ...newItemData,
      id: Date.now(),
      category_id: catObj.id,
      price: parseInt(newItemData.price, 10),
      is_available: true,
      image: newItemData.image || 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80'
    });

    setShowAddModal(false);
    setNewItemData({
      name: '',
      category_slug: 'signature-coffee',
      description: '',
      price: '',
      image: '',
      is_beverage: true,
      temp_options: 'both',
      is_milk_based: true,
      is_bestseller: false
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-12 text-[#1C1917] font-brand select-none">
      {/* Sticky Widescreen Header */}
      <div className="sticky top-0 z-30 bg-white px-6 py-3.5 shadow-xs border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C85A32] text-white flex items-center justify-center shadow-md">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-base text-[#1C1917] tracking-tight">
              PENGATURAN MENU & STOK (POS MANAGER)
            </h1>
            <p className="text-xs text-[#78716C]">
              Atur Ketersediaan Stok Realtime & Edit Harga Menu Untuk Outlet
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-fast bg-[#C85A32] text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:bg-[#A44321] transition-all uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" /> Tambah Menu Baru
        </button>
      </div>

      <div className="p-6 space-y-5 max-w-7xl mx-auto">
        {/* Search & Filter Bar Bar */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex items-center shadow-xs rounded-xl bg-[#FAF7F2] w-full md:w-80 overflow-hidden">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama menu..."
              className="w-full pl-10 pr-4 py-2 text-xs font-medium outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#1C1917] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#78716C] hover:bg-slate-200'
              }`}
            >
              Semua Kategori ({menus.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#78716C] hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid (3-4 Columns on Tablet & Laptop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMenus.map(menu => {
            const isAvailable = menu.is_available !== false;

            return (
              <div
                key={menu.id}
                className={`p-4 rounded-2xl bg-white shadow-md flex flex-col justify-between gap-3 transition-all border border-slate-200/60 ${
                  !isAvailable ? 'opacity-70 bg-slate-50' : ''
                }`}
              >
                {/* Top Image + Category Badge */}
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={menu.image}
                    alt={menu.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-extrabold text-red-300 uppercase tracking-widest backdrop-blur-xs">
                      STOK HABIS
                    </div>
                  )}

                  {menu.is_bestseller && isAvailable && (
                    <span className="absolute top-2 left-2 bg-[#C85A32] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-200" /> Bestseller
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1 flex-1">
                  <h4 className="font-display font-extrabold text-sm text-[#1C1917] truncate">
                    {menu.name}
                  </h4>
                  <p className="text-xs text-[#78716C] line-clamp-2 leading-relaxed">
                    {menu.description}
                  </p>
                </div>

                {/* Price & Realtime Availability Controls */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-extrabold text-sm text-[#C85A32] block">
                      Rp {formatRupiah(menu.price)}
                    </span>
                    <button
                      onClick={() => {
                        setEditingPriceMenu(menu);
                        setNewPriceInput(menu.price.toString());
                      }}
                      className="text-[11px] text-[#78716C] hover:text-[#C85A32] underline flex items-center gap-1 mt-0.5"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Harga
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider ${
                      isAvailable ? 'text-emerald-700' : 'text-red-500'
                    }`}>
                      {isAvailable ? 'STOK ADA' : 'HABIS'}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => onToggleAvailability(menu.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isAvailable ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isAvailable ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Price Modal */}
      <AnimatePresence>
        {editingPriceMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 text-center shadow-2xl">
              <h3 className="font-display font-extrabold text-base text-[#1C1917]">
                Edit Harga Menu: {editingPriceMenu.name}
              </h3>

              <form onSubmit={handleSavePrice} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-[#78716C] mb-1 font-bold uppercase">
                    HARGA BARU (RUPIAH)
                  </label>
                  <input
                    type="number"
                    required
                    autoFocus
                    value={newPriceInput}
                    onChange={(e) => setNewPriceInput(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 font-mono font-extrabold text-lg text-[#1C1917] outline-none text-center bg-[#FAF7F2]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPriceMenu(null)}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-100 font-bold text-xs text-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-[#C85A32] font-bold text-xs text-white shadow-md"
                  >
                    Simpan Harga
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Menu Item Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-extrabold text-base text-[#1C1917]">
                  Tambah Menu Baru Ke POS Terminal
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1C1917]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateMenuSubmit} className="space-y-4 text-xs font-brand">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1C1917] mb-1">Nama Menu:</label>
                    <input
                      type="text"
                      required
                      value={newItemData.name}
                      onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                      placeholder="Cth: Aren Latte Double Shot"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-[#FAF7F2] outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#1C1917] mb-1">Kategori:</label>
                    <select
                      value={newItemData.category_slug}
                      onChange={(e) => setNewItemData({ ...newItemData, category_slug: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-[#FAF7F2] outline-none font-bold"
                    >
                      {categories.map(c => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">Harga (Rp):</label>
                  <input
                    type="number"
                    required
                    value={newItemData.price}
                    onChange={(e) => setNewItemData({ ...newItemData, price: e.target.value })}
                    placeholder="Cth: 25000"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-[#FAF7F2] outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">Deskripsi Ringkas:</label>
                  <textarea
                    rows={2}
                    value={newItemData.description}
                    onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                    placeholder="Cth: Espresso houseblend khas Dump Cafe..."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1C1917] mb-1">URL Foto (Opsional):</label>
                  <input
                    type="url"
                    value={newItemData.image}
                    onChange={(e) => setNewItemData({ ...newItemData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={newItemData.is_bestseller}
                      onChange={(e) => setNewItemData({ ...newItemData, is_bestseller: e.target.checked })}
                      className="w-4 h-4 accent-[#C85A32]"
                    />
                    Tandai Sebagai Bestseller
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] text-white font-bold py-3.5 px-4 rounded-2xl shadow-md text-xs uppercase tracking-wider mt-3"
                >
                  Simpan Menu Baru
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
