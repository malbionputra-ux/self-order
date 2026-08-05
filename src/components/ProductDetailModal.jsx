import React, { useState, useEffect } from 'react';
import { X, Sparkles, Flame, Snowflake, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

export default function ProductDetailModal({ menu, isOpen, onClose, onAddToCart }) {
  const [temperature, setTemperature] = useState('ice');
  const [sugarLevel, setSugarLevel] = useState('Normal Sugar');
  const [milkOption, setMilkOption] = useState('Fresh Milk');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (menu) {
      setQuantity(1);
      setNotes('');
      setSugarLevel('Normal Sugar');
      setMilkOption('Fresh Milk');
      if (menu.temp_options === 'hot_only') {
        setTemperature('hot');
      } else {
        setTemperature('ice');
      }
    }
  }, [menu]);

  if (!isOpen || !menu) return null;

  const getMilkExtraPrice = () => {
    if (!menu.is_milk_based || temperature === 'hot') return 0;
    if (milkOption === 'Oat Milk (+7k)') return 7000;
    if (milkOption === 'Almond Milk (+8k)') return 8000;
    return 0;
  };

  const extraPrice = getMilkExtraPrice();
  const unitPrice = menu.price + extraPrice;
  const totalPrice = unitPrice * quantity;

  const currentDisplayImage = (menu.is_beverage && temperature === 'hot' && menu.image_hot)
    ? menu.image_hot
    : menu.image;

  const handleAddToCart = () => {
    const customizations = {};
    if (menu.is_beverage) {
      if (menu.temp_options === 'both') {
        customizations.temp = temperature === 'ice' ? 'Ice' : 'Hot';
      }
      if (temperature === 'ice') {
        customizations.ice = 'Normal Ice';
        customizations.sugar = sugarLevel;
        if (menu.is_milk_based) {
          customizations.milk = milkOption;
        }
      } else {
        customizations.sugar = sugarLevel;
      }
    }
    onAddToCart(menu, customizations, notes, extraPrice, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="glass-card rounded-[24px] overflow-hidden w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl relative"
        >
          {/* Hero Image — 45% Height */}
          <div className="relative w-full h-52 bg-[#0D0B0A] overflow-hidden flex-shrink-0">
            <motion.img
              key={currentDisplayImage}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={currentDisplayImage}
              alt={menu.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-black/30" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="btn-fast absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center border border-white/15 hover:bg-black/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Bestseller Badge */}
            {menu.is_bestseller && (
              <span className="absolute top-3.5 left-3.5 bg-[#E8703E]/90 text-white font-brand text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-200" /> Bestseller
              </span>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4 font-brand">
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg text-[#F5F0EB]">{menu.name}</h3>
                <span className="font-mono font-bold text-base text-[#E8703E]">
                  Rp {formatRupiah(menu.price)}
                </span>
              </div>
              <p className="text-xs text-[#9A8E85] mt-1 leading-relaxed">{menu.description}</p>
            </div>

            {/* Temperature Toggle */}
            {menu.is_beverage && menu.temp_options === 'both' && (
              <div className="space-y-2">
                <label className="block font-brand font-bold text-xs text-[#F5F0EB]">Suhu Saji:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTemperature('ice')}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                      temperature === 'ice'
                        ? 'border-[#E8703E]/50 bg-[#E8703E]/10 text-[#FF9E79]'
                        : 'border-white/[0.06] bg-white/[0.03] text-[#9A8E85]'
                    }`}
                  >
                    <Snowflake className="w-4 h-4 text-sky-400" />
                    <span>Dingin (Ice)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemperature('hot')}
                    className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                      temperature === 'hot'
                        ? 'border-[#E8703E]/50 bg-[#E8703E]/10 text-[#FF9E79]'
                        : 'border-white/[0.06] bg-white/[0.03] text-[#9A8E85]'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Hangat (Hot)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Milk Options */}
            {menu.is_beverage && menu.is_milk_based && temperature === 'ice' && (
              <div className="space-y-2">
                <label className="block font-brand font-bold text-xs text-[#F5F0EB]">Pilihan Susu:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Fresh Milk', 'Oat Milk (+7k)', 'Almond Milk (+8k)'].map(milk => (
                    <button
                      key={milk}
                      type="button"
                      onClick={() => setMilkOption(milk)}
                      className={`py-2 px-2 rounded-xl border font-bold text-[11px] transition-all btn-fast ${
                        milkOption === milk
                          ? 'border-[#E8703E]/50 bg-[#E8703E] text-white'
                          : 'border-white/[0.06] bg-white/[0.03] text-[#9A8E85]'
                      }`}
                    >
                      {milk}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#F5F0EB] mb-1.5">Catatan Khusus:</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cth: Sedikit es, jangan terlalu manis..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.06] focus:border-[#E8703E]/40 text-xs font-brand text-[#F5F0EB] placeholder-[#6B5F56] outline-none transition-colors bg-white/[0.03]"
              />
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 border-t border-white/[0.04] flex items-center gap-3 bg-[#0D0B0A]/80 backdrop-blur-xl">
            {/* Quantity Stepper */}
            <div className="flex items-center glass-panel rounded-2xl px-3 py-1.5 gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn-fast w-7 h-7 rounded-full text-[#F5F0EB] flex items-center justify-center hover:bg-white/10"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <motion.span
                key={quantity}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-mono font-bold text-sm text-[#F5F0EB] w-4 text-center"
              >
                {quantity}
              </motion.span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="btn-fast w-7 h-7 rounded-full text-[#F5F0EB] flex items-center justify-center hover:bg-white/10"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              className="btn-cta flex-1 bg-gradient-to-r from-[#C85A32] to-[#E8703E] text-white font-brand font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-xl shadow-[#E8703E]/25 text-xs"
            >
              <span className="flex items-center gap-1.5 relative z-10">
                <ShoppingBag className="w-4 h-4" /> Tambah
              </span>
              <span className="font-mono font-bold relative z-10">
                Rp {formatRupiah(totalPrice)}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
