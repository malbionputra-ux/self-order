import React from 'react';
import { ArrowRight, Grid, Coffee, Utensils, Sparkles, CupSoda, Croissant } from 'lucide-react';
import { motion } from 'framer-motion';
import { categories, menus } from '../data/menuData';

const cardVariants = {
  hidden: (i) => ({
    opacity: 0,
    y: 35,
    scale: 0.88,
  }),
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

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
            <motion.div
              key={cat.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ 
                y: -6, 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(44,34,30,0.25)",
              }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelectCategory(cat.slug)}
              className="bg-gradient-to-br from-[#2C221E] via-[#382B25] to-[#2C221E] rounded-[28px] p-4 text-center text-white cursor-pointer shadow-xl shadow-[#2C221E]/20 border border-white/10 flex flex-col items-center justify-between min-h-[210px] relative overflow-hidden group"
            >
              {/* Subtle Warm Ambient Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C85A32]/20 rounded-full blur-xl pointer-events-none group-hover:bg-[#C85A32]/35 transition-all duration-300" />

              {/* Circle Image with Border */}
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-[#C85A32]/60 shadow-lg shadow-[#C85A32]/20 bg-[#2C221E] relative z-10 group-hover:scale-108 transition-transform duration-300">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
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
                <span className="bg-[#C85A32] text-white text-[11px] font-brand font-extrabold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 shadow-md shadow-[#C85A32]/30 group-hover:bg-[#E8703E] transition-colors">
                  {itemCount} Menu <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
