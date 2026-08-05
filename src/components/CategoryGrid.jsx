import React from 'react';
import { ArrowRight, Grid } from 'lucide-react';
import { categories, menus } from '../data/menuData';

export default function CategoryGrid({ onSelectCategory }) {
  return (
    <div className="p-4 bg-[#FAF7F2] min-h-[calc(100vh-230px)]">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-1.5 font-brand font-extrabold text-sm text-[#2C221E] tracking-wide">
          <Grid className="w-4 h-4 text-[#C85A32]" />
          <span>PILIH KATEGORI MENU</span>
        </div>
        <span className="font-mono text-xs text-[#7E746F]">Sentuh untuk pilih</span>
      </div>

      {/* 4 Large Pinterest Category Cards */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat, index) => {
          const itemCount = menus.filter(m => m.category_slug === cat.slug).length;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="menu-card gpu-accelerated animate-fade-in-up bg-gradient-to-br from-[#2C221E] via-[#382B25] to-[#2C221E] rounded-[28px] p-4 text-center text-white cursor-pointer shadow-xl shadow-[#2C221E]/15 border border-white/10 flex flex-col items-center justify-between min-h-[210px] relative overflow-hidden group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Circle Image with Border & Fallback */}
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-[#C85A32]/60 shadow-lg bg-[#2C221E] relative z-10 group-hover:scale-105 transition-transform duration-200">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="relative z-10 w-full flex flex-col items-center">
                <h3 className="font-brand font-extrabold text-sm text-white mb-0.5 leading-snug group-hover:text-amber-200 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-white/60 leading-tight mb-3 line-clamp-2">
                  {cat.subtitle}
                </p>

                {/* Pill Button */}
                <span className="bg-[#C85A32] text-white text-[11px] font-brand font-extrabold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 shadow-md group-hover:bg-[#E8703E] transition-colors">
                  {itemCount} Menu <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
