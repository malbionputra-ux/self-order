import React from 'react';
import { ArrowRight, Grid } from 'lucide-react';
import { categories, menus } from '../data/menuData';

export default function CategoryGrid({ onSelectCategory }) {
  return (
    <div className="p-4 min-h-[calc(100vh-230px)]">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2 font-brand font-extrabold text-xs text-[#2C221E] tracking-wider uppercase">
          <Grid className="w-4 h-4 text-[#C85A32]" />
          <span>PILIH KATEGORI MENU</span>
        </div>
        <span className="font-mono text-[10px] text-[#7E746F]">Sentuh untuk pilih</span>
      </div>

      {/* Bento Grid — 1 Hero + 3 Cards */}
      <div className="bento-grid">
        {categories.map((cat, index) => {
          const itemCount = menus.filter(m => m.category_slug === cat.slug).length;
          const isHero = index === 0;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`
                menu-card rounded-[24px] overflow-hidden cursor-pointer relative group shadow-xl shadow-[#2C221E]/10 border border-[#EFE9E2]
                animate-slide-reveal
                ${isHero ? 'bento-hero min-h-[200px]' : 'min-h-[185px]'}
              `}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              {/* Full-Bleed Image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80';
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* High Contrast Gradient Overlay for Clear Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E] via-[#2C221E]/40 to-transparent" />

              {/* Content Overlay */}
              <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
                <div>
                  <h3 className={`font-brand font-extrabold text-white leading-snug group-hover:text-amber-200 transition-colors duration-300 ${
                    isHero ? 'text-base' : 'text-sm'
                  }`}>
                    {cat.name}
                  </h3>
                  <p className={`text-white/70 leading-tight mt-0.5 line-clamp-1 ${
                    isHero ? 'text-xs' : 'text-[11px]'
                  }`}>
                    {cat.subtitle}
                  </p>
                </div>

                {/* Action Pill */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="bg-[#C85A32] text-white text-[11px] font-brand font-extrabold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md group-hover:bg-[#E8703E] transition-colors">
                    {itemCount} Menu <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
