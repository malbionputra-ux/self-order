import React, { useState } from 'react';
import { ArrowLeft, Plus, Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { categories, menus, formatRupiah } from '../data/menuData';

export default function MenuGrid({ activeSlug, onBack, onOpenDetail }) {
  const [currentCategorySlug, setCurrentCategorySlug] = useState(activeSlug || 'signature-coffee');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = categories.find(c => c.slug === currentCategorySlug) || categories[0];

  const filteredMenus = menus.filter(menu => {
    const matchesCategory = currentCategorySlug === 'all' || menu.category_slug === currentCategorySlug;
    const matchesSearch = !searchQuery || 
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryPills = [
    { slug: 'all', name: '⭐ Popular' },
    { slug: 'signature-coffee', name: '☕ Signature Coffee' },
    { slug: 'non-coffee', name: '🍹 Non-Coffee' },
    { slug: 'pastry-bakery', name: '🥐 Pastry & Bakery' },
    { slug: 'eatery-mains', name: '🍔 Eatery & Mains' }
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAF7F2]">
      {/* Sticky Back Header Bar */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-[65px] z-20 bg-white/95 backdrop-blur-xl px-4 py-3 border-b border-[#EFE9E2] flex items-center justify-between shadow-xs"
      >
        <motion.button
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={onBack}
          className="bg-[#FAF7F2] text-[#2C221E] hover:bg-[#C85A32] hover:text-white font-brand font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-[#EFE9E2] flex items-center gap-1.5 transition-colors duration-300 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali Ke Kategori
        </motion.button>
        <span className="font-serif font-bold text-sm text-[#C85A32]">
          {activeCategory?.name || 'Daftar Menu'}
        </span>
      </motion.div>

      <div className="p-4">
        {/* Search Bar */}
        <div className="relative flex items-center shadow-xs rounded-2xl bg-white border border-[#EFE9E2] focus-within:border-[#C85A32] focus-within:shadow-md transition-all duration-300 mb-3 overflow-hidden">
          <Search className="w-4 h-4 text-[#7E746F] absolute left-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kopi, mocktail, croissant, burger..."
            className="w-full pl-10 pr-10 py-2.5 text-xs font-brand text-[#2C221E] placeholder-[#7E746F]/70 outline-none bg-transparent"
          />
          <div className="absolute right-3 p-1.5 bg-[#FAF7F2] rounded-xl text-[#C85A32]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Horizontal Category Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-4">
          {categoryPills.map((pill) => {
            const isActive = currentCategorySlug === pill.slug;
            return (
              <motion.button
                key={pill.slug}
                whileTap={{ scale: 0.93 }}
                onClick={() => setCurrentCategorySlug(pill.slug)}
                className={`px-3.5 py-1.5 rounded-full font-brand font-bold text-xs whitespace-nowrap transition-all duration-300 shadow-xs flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#C85A32] text-white shadow-md shadow-[#C85A32]/30 scale-105'
                    : 'bg-white text-[#2C221E] border border-[#EFE9E2] hover:border-[#C85A32]/40'
                }`}
              >
                {pill.name}
              </motion.button>
            );
          })}
        </div>

        {/* Category Header Title */}
        <div className="flex items-center justify-between mb-3.5 px-1">
          <h2 className="font-serif font-bold text-sm text-[#2C221E] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C85A32]" />
            {activeCategory?.name || 'Daftar Menu'}
          </h2>
          <span className="bg-[#FAF7F2] text-[#C85A32] font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#C85A32]/20">
            {filteredMenus.length} Menu
          </span>
        </div>

        {/* 2-Column Pinterest-Style Dark Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {filteredMenus.map((menu, index) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 25, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.35, 
                delay: (index % 6) * 0.06,
                ease: [0.16, 1, 0.3, 1] 
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onOpenDetail(menu)}
              className="bg-gradient-to-br from-[#2C221E] via-[#352924] to-[#2C221E] rounded-[28px] p-3 text-white border border-white/10 shadow-xl shadow-[#2C221E]/20 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
            >
              {/* Ambient Background Light Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C85A32]/15 rounded-full blur-xl pointer-events-none group-hover:bg-[#C85A32]/30 transition-all duration-300" />

              {/* Favorite / Best Seller Badge */}
              {menu.is_bestseller && (
                <span className="absolute top-3 left-3 bg-[#C85A32]/90 backdrop-blur-md text-white font-brand text-[9px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md z-10 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-200" /> Top
                </span>
              )}

              {/* Floating Top Image */}
              <div className="relative w-28 h-28 mx-auto my-2 rounded-full overflow-hidden bg-[#2C221E] border-2 border-white/15 shadow-lg group-hover:scale-108 transition-transform duration-300 flex-shrink-0">
                <img 
                  src={menu.image} 
                  alt={menu.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Description */}
              <div className="text-center px-1 my-1">
                <h4 className="font-brand font-extrabold text-xs text-white leading-snug line-clamp-1 group-hover:text-amber-200 transition-colors">
                  {menu.name}
                </h4>
                <p className="text-[10px] text-white/60 line-clamp-1 mt-0.5 leading-tight">
                  {menu.description}
                </p>
              </div>

              {/* Bottom White Action Pill Capsule (Price + Add Button) */}
              <div className="bg-white rounded-full p-1 pl-3.5 flex items-center justify-between mt-2 shadow-lg shadow-black/30">
                <span className="font-mono font-extrabold text-xs text-[#2C221E]">
                  Rp {formatRupiah(menu.price)}
                </span>
                <motion.div 
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  className="w-7 h-7 rounded-full bg-[#C85A32] text-white flex items-center justify-center shadow-md shadow-[#C85A32]/40"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
