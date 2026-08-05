import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Sparkles, Search, SlidersHorizontal } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2]">
      {/* Sticky Back Header Bar */}
      <div className="sticky top-[57px] z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 border-none flex items-center justify-between shadow-sm">
        <button
          onClick={onBack}
          className="btn-fast bg-[#FAF7F2] text-[#1C1917] hover:bg-[#C85A32] hover:text-white font-brand font-extrabold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors border-none shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali Ke Kategori
        </button>
        <span className="font-display font-extrabold text-sm text-[#C85A32]">
          {activeCategory?.name || 'Daftar Menu'}
        </span>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Search Bar */}
        <div className="relative flex items-center shadow-sm rounded-2xl bg-white border-none transition-colors overflow-hidden">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Cari menu di ${activeCategory?.name || 'kategori ini'}...`}
            className="w-full pl-10 pr-10 py-2.5 text-xs font-brand font-medium text-[#1C1917] placeholder-[#78716C]/70 outline-none bg-transparent border-none"
          />
          <div className="absolute right-3 p-1.5 bg-[#FAF7F2] rounded-xl text-[#C85A32]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Category Header Title */}
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display font-extrabold text-sm text-[#1C1917] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C85A32]" />
            {activeCategory?.name || 'Daftar Menu'}
          </h2>
          <span className="bg-[#2C221E] text-white font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border-none">
            {filteredMenus.length} Menu
          </span>
        </div>

        {/* 2-Column Ultra-Clean Modern White Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {filteredMenus.map((menu, index) => (
            <div
              key={menu.id}
              onClick={() => onOpenDetail(menu)}
              className="menu-card gpu-accelerated animate-fade-in-up bg-white rounded-[24px] text-[#1C1917] border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
              style={{ animationDelay: `${(index % 6) * 0.04}s` }}
            >
              {/* Bestseller Badge */}
              {menu.is_bestseller && (
                <span className="absolute top-2.5 left-2.5 bg-[#C85A32] text-white font-brand text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md z-10 flex items-center gap-0.5 border-none">
                  <Sparkles className="w-2.5 h-2.5 text-amber-200" /> Top
                </span>
              )}

              {/* Full-Bleed Rectangular Food Image Header */}
              <div className="relative w-full h-36 overflow-hidden bg-[#FAF7F2]">
                <img
                  src={menu.image}
                  alt={menu.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                />
              </div>

              {/* Card Body */}
              <div className="p-3 pt-2.5 flex flex-col flex-1 justify-between">
                <div>
                  <h4 className="font-display font-extrabold text-xs text-[#1C1917] leading-snug line-clamp-1 group-hover:text-[#C85A32] transition-colors">
                    {menu.name}
                  </h4>
                  <p className="text-[10px] text-[#78716C] line-clamp-2 mt-1 leading-normal font-medium">
                    {menu.description}
                  </p>
                </div>

                {/* High-Contrast Espresso Action Pill Capsule (Price + Add Button) */}
                <div className="bg-[#2C221E] rounded-full p-1 pl-3.5 flex items-center justify-between mt-3 shadow-md border-none">
                  <span className="font-mono font-extrabold text-xs text-white">
                    Rp {formatRupiah(menu.price)}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#C85A32] text-white flex items-center justify-center shadow-md group-hover:bg-[#E8703E] transition-colors border-none">
                    <Plus className="w-4 h-4 stroke-[3]" />
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
