import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Sparkles, Search } from 'lucide-react';
import { categories, menus, formatRupiah } from '../data/menuData';

export default function MenuGrid({ activeSlug, onBack, onOpenDetail }) {
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = useMemo(() => {
    return categories.find(c => c.slug === activeSlug) || categories[0];
  }, [activeSlug]);

  const filteredMenus = useMemo(() => {
    return menus.filter(menu => {
      const matchesCategory = menu.category_slug === activeSlug;
      const matchesSearch = !searchQuery ||
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeSlug, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-140px)]">
      {/* Sticky Back Header */}
      <div className="sticky top-[53px] z-20 glass-panel px-4 py-2.5 flex items-center justify-between border-b border-white/[0.04]">
        <button
          onClick={onBack}
          className="btn-fast bg-white/[0.05] text-[#F5F0EB] hover:bg-[#E8703E] hover:text-white font-brand font-bold text-xs px-3.5 py-1.5 rounded-full border border-white/[0.08] flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <span className="font-serif text-sm text-[#E8703E]">
          {activeCategory?.name || 'Menu'}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Bar — Glass Morphism */}
        <div className="relative glass-panel rounded-2xl overflow-hidden focus-within:border-[#E8703E]/40 transition-colors">
          <Search className="w-4 h-4 text-[#6B5F56] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari di ${activeCategory?.name || 'kategori ini'}...`}
            className="w-full pl-10 pr-4 py-3 text-xs font-brand text-[#F5F0EB] placeholder-[#6B5F56] outline-none bg-transparent"
          />
        </div>

        {/* Category Title */}
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-serif text-sm text-[#F5F0EB] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E8703E] shadow-sm shadow-[#E8703E]/50" />
            {activeCategory?.name || 'Daftar Menu'}
          </h2>
          <span className="bg-white/[0.05] text-[#E8703E] font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#E8703E]/15">
            {filteredMenus.length} Menu
          </span>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredMenus.map((menu, index) => (
            <div
              key={menu.id}
              onClick={() => onOpenDetail(menu)}
              className="menu-card glass-card rounded-[20px] overflow-hidden cursor-pointer relative group animate-slide-reveal"
              style={{ animationDelay: `${(index % 6) * 0.06}s` }}
            >
              {/* Bestseller Badge */}
              {menu.is_bestseller && (
                <div className="absolute top-2.5 left-2.5 z-20 bg-[#E8703E]/90 text-white font-brand text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md animate-shimmer">
                  <Sparkles className="w-2.5 h-2.5 text-amber-200" /> Top
                </div>
              )}

              {/* Food Image — Full Bleed Rectangle */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1A1614]">
                <img
                  src={menu.image}
                  alt={menu.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Bottom fade into card */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1A1614] to-transparent" />
              </div>

              {/* Card Body */}
              <div className="p-3 pt-1.5 space-y-2">
                <div>
                  <h4 className="font-brand font-bold text-xs text-[#F5F0EB] leading-snug line-clamp-1 group-hover:text-[#FF9E79] transition-colors duration-300">
                    {menu.name}
                  </h4>
                  <p className="text-[10px] text-[#6B5F56] line-clamp-1 mt-0.5">
                    {menu.description}
                  </p>
                </div>

                {/* Price + Add Button Row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#D4A574]">
                    Rp {formatRupiah(menu.price)}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#E8703E] text-white flex items-center justify-center shadow-md shadow-[#E8703E]/25 group-hover:scale-110 transition-transform duration-200">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
