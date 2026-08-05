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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="bg-white rounded-[32px] overflow-hidden w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl relative border-none"
        >
          {/* Header Image Area */}
          <div className="relative w-full h-56 bg-[#2C221E] overflow-hidden flex-shrink-0">
            <img
              src={currentDisplayImage}
              alt={menu.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80';
              }}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />

            <button
              onClick={onClose}
              className="btn-fast absolute top-3.5 right-3.5 w-8.5 h-8.5 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md border-none hover:bg-black/60 transition-colors shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            {menu.is_bestseller && (
              <span className="absolute top-3.5 left-3.5 bg-[#C85A32] text-white font-brand text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-200" /> Bestseller Dump Cafe
              </span>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4 font-brand bg-white">
            {/* Title & Description */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-extrabold text-xl text-[#1C1917] tracking-tight">
                  {menu.name}
                </h3>
                <span className="font-mono font-extrabold text-base text-[#C85A32]">
                  Rp {formatRupiah(menu.price)}
                </span>
              </div>
              <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed font-medium">
                {menu.description}
              </p>
            </div>

            {/* Temperature Options — Borderless Modern Pills */}
            {menu.is_beverage && menu.temp_options === 'both' && (
              <div className="space-y-2">
                <label className="block font-brand font-bold text-xs text-[#1C1917]">
                  Suhu Saji:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTemperature('ice')}
                    className={`py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast border-none ${
                      temperature === 'ice'
                        ? 'bg-[#FDF5F0] text-[#C85A32] shadow-sm'
                        : 'bg-[#F5F0EB] text-[#78716C] hover:bg-[#EFE9E2]'
                    }`}
                  >
                    <Snowflake className="w-4 h-4 text-sky-500" />
                    <span>Dingin (Ice)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTemperature('hot')}
                    className={`py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast border-none ${
                      temperature === 'hot'
                        ? 'bg-[#FDF5F0] text-[#C85A32] shadow-sm'
                        : 'bg-[#F5F0EB] text-[#78716C] hover:bg-[#EFE9E2]'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Hangat (Hot)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Milk Options — Borderless Pills */}
            {menu.is_beverage && menu.is_milk_based && temperature === 'ice' && (
              <div className="space-y-2">
                <label className="block font-brand font-bold text-xs text-[#1C1917]">
                  Pilihan Susu:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Fresh Milk', 'Oat Milk (+7k)', 'Almond Milk (+8k)'].map(milk => (
                    <button
                      key={milk}
                      type="button"
                      onClick={() => setMilkOption(milk)}
                      className={`py-2.5 px-2 rounded-2xl font-bold text-[11px] transition-all btn-fast border-none ${
                        milkOption === milk
                          ? 'bg-[#C85A32] text-white shadow-md'
                          : 'bg-[#F5F0EB] text-[#78716C] hover:bg-[#EFE9E2]'
                      }`}
                    >
                      {milk}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Input — Borderless Tinted Input */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#1C1917] mb-1.5">
                Catatan Khusus Barista / Kitchen:
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cth: Sedikit es, jangan terlalu manis..."
                className="w-full px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-[#C85A32]/30 text-xs font-brand outline-none transition-colors bg-[#F5F0EB] text-[#1C1917] placeholder-[#A8A29E]"
              />
            </div>
          </div>

          {/* Footer Action Bar — Borderless Elevation */}
          <div className="p-4 bg-[#FAF7F2] border-none flex items-center gap-3 shadow-inner">
            <div className="flex items-center bg-white rounded-2xl px-3.5 py-1.5 gap-3 shadow-md border-none">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn-fast w-7 h-7 rounded-full text-[#1C1917] font-extrabold flex items-center justify-center hover:bg-slate-100"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-extrabold text-sm text-[#1C1917] w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="btn-fast w-7 h-7 rounded-full text-[#1C1917] font-extrabold flex items-center justify-center hover:bg-slate-100"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-fast flex-1 bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-lg shadow-[#C85A32]/30 tracking-wide text-xs border-none"
            >
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" /> + Tambah Ke Keranjang
              </span>
              <span className="font-mono font-bold">
                Rp {formatRupiah(totalPrice)}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
