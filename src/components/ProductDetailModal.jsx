import React, { useState, useEffect, useMemo } from 'react';
import { X, Sparkles, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { delay: 0.1, duration: 0.25 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.82, y: 60, rotateX: 8 },
  visible: { 
    opacity: 1, scale: 1, y: 0, rotateX: 0,
    transition: { type: "spring", damping: 22, stiffness: 280 }
  },
  exit: { 
    opacity: 0, scale: 0.88, y: 40,
    transition: { duration: 0.25, ease: "easeIn" }
  },
};

const pillVariants = {
  unselected: { scale: 1, backgroundColor: "rgb(255,255,255)" },
  selected: { 
    scale: 1.05,
    backgroundColor: "rgb(253,245,240)",
    transition: { type: "spring", stiffness: 500, damping: 20 }
  },
};

export default function ProductDetailModal({ menu, isOpen, onClose, onAddToCart }) {
  const [tempSelection, setTempSelection] = useState('ice');
  const [iceLevel, setIceLevel] = useState('Normal Ice');
  const [sugarLevel, setSugarLevel] = useState('Normal Sweet');
  const [milkType, setMilkType] = useState('Fresh Milk');
  const [milkExtraPrice, setMilkExtraPrice] = useState(0);
  const [warmOption, setWarmOption] = useState('Hangatkan (Warmed)');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (menu) {
      setQuantity(1);
      setNotes('');
      setIceLevel(menu.temp_options === 'hot_only' ? 'Hot (Hangat)' : 'Normal Ice');
      setTempSelection(menu.temp_options === 'hot_only' ? 'hot' : 'ice');
      setSugarLevel('Normal Sweet');
      setMilkType('Fresh Milk');
      setMilkExtraPrice(0);
      setWarmOption('Hangatkan (Warmed)');
      setCurrentImage(menu.temp_options === 'hot_only' ? (menu.image_hot || menu.image) : (menu.image_ice || menu.image));
      setAddedAnimation(false);
    }
  }, [menu]);

  if (!isOpen || !menu) return null;

  const handleTempChange = (type, val) => {
    setTempSelection(type);
    setIceLevel(val);
    if (type === 'hot' && menu.image_hot) {
      setCurrentImage(menu.image_hot);
    } else if (type === 'ice' && (menu.image_ice || menu.image)) {
      setCurrentImage(menu.image_ice || menu.image);
    }
  };

  const handleMilkChange = (type, extra) => {
    setMilkType(type);
    setMilkExtraPrice(extra);
  };

  const unitPrice = menu.price + (menu.is_beverage && menu.is_milk_based ? milkExtraPrice : 0);
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    setAddedAnimation(true);
    const customizations = {};
    if (menu.is_beverage) {
      customizations.ice = iceLevel;
      customizations.sugar = sugarLevel;
      if (menu.is_milk_based) {
        customizations.milk = milkType;
      }
    } else {
      customizations.warm = warmOption;
    }

    setTimeout(() => {
      onAddToCart(menu, customizations, notes, milkExtraPrice, quantity);
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <motion.div 
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-md"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl shadow-black/30 flex flex-col max-h-[90vh]"
          style={{ perspective: '1000px' }}
        >
          {/* Header Image */}
          <div className="relative w-full h-56 bg-[#2C221E] overflow-hidden flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                src={currentImage}
                alt={menu.name}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              onClick={onClose}
              className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/40 backdrop-blur-lg text-white flex items-center justify-center border border-white/20 hover:bg-[#C85A32] transition-colors duration-300 shadow-lg"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {menu.is_bestseller && (
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-3.5 left-3.5 bg-[#C85A32]/90 backdrop-blur-md text-white font-brand text-xs font-extrabold px-3 py-1 rounded-full shadow-lg shadow-[#C85A32]/30 flex items-center gap-1 shimmer-badge"
              >
                <Sparkles className="w-3 h-3 text-amber-200" /> Favorite
              </motion.span>
            )}

            {/* Product name overlay at bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-3 left-4 right-4"
            >
              <h3 className="font-brand font-extrabold text-lg text-white drop-shadow-lg leading-snug">
                {menu.name}
              </h3>
            </motion.div>
          </div>

          {/* Modal Body */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-5 overflow-y-auto flex-1 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="bg-[#C85A32]/10 text-[#C85A32] font-brand font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wide">
                {menu.category_slug?.replace('-', ' ') || 'SIGNATURE'}
              </span>
              <motion.span 
                key={unitPrice}
                initial={{ scale: 1.2, color: "#E8703E" }}
                animate={{ scale: 1, color: "#C85A32" }}
                className="font-brand font-extrabold text-base"
              >
                Rp {formatRupiah(unitPrice)}
              </motion.span>
            </div>

            <p className="text-xs text-[#7E746F] leading-relaxed">
              {menu.description}
            </p>

            {/* Beverage Customizations */}
            {menu.is_beverage && (
              <div className="space-y-3.5">
                {/* Temperature / Ice */}
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EFE9E2]"
                >
                  <label className="block font-brand font-bold text-xs text-[#2C221E] mb-2.5">
                    {menu.temp_options === 'hot_only' ? 'Suhu Penyajian' : menu.temp_options === 'ice_only' ? 'Level Es (Ice Level)' : 'Temperature & Level Es'}
                  </label>
                  
                  {menu.temp_options === 'hot_only' ? (
                    <motion.button
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-full py-2.5 px-3 rounded-xl border-2 border-[#C85A32] bg-[#FDF5F0] text-[#C85A32] font-brand font-bold text-xs shadow-sm"
                    >
                      ☕ Hot (Hangat)
                    </motion.button>
                  ) : menu.temp_options === 'ice_only' ? (
                    <div className="grid grid-cols-3 gap-2">
                      {['Normal Ice', 'Less Ice', 'Tanpa Es (No Ice)'].map((option) => (
                        <motion.button
                          key={option}
                          variants={pillVariants}
                          animate={iceLevel === option ? "selected" : "unselected"}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleTempChange('ice', option)}
                          className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs transition-colors text-center ${
                            iceLevel === option
                              ? 'border-[#C85A32] text-[#C85A32] shadow-sm shadow-[#C85A32]/15'
                              : 'border-[#EFE9E2] text-[#2C221E] hover:border-[#C85A32]/40'
                          }`}
                        >
                          {option.replace('Tanpa Es (No Ice)', 'No Ice')}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Normal Ice', type: 'ice', val: 'Normal Ice' },
                        { label: 'Less Ice', type: 'ice', val: 'Less Ice' },
                        { label: 'Hot (Hangat)', type: 'hot', val: 'Hot (Hangat)' },
                      ].map((option) => (
                        <motion.button
                          key={option.val}
                          variants={pillVariants}
                          animate={iceLevel === option.val ? "selected" : "unselected"}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleTempChange(option.type, option.val)}
                          className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs transition-colors ${
                            iceLevel === option.val
                              ? 'border-[#C85A32] text-[#C85A32] shadow-sm shadow-[#C85A32]/15'
                              : 'border-[#EFE9E2] text-[#2C221E] hover:border-[#C85A32]/40'
                          }`}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Sugar */}
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EFE9E2]"
                >
                  <label className="block font-brand font-bold text-xs text-[#2C221E] mb-2.5">
                    Tingkat Manis (Sugar Level)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Normal (100%)', val: 'Normal Sweet' },
                      { label: 'Less (50%)', val: 'Less Sweet' },
                      { label: 'No Sugar', val: 'No Sugar' }
                    ].map((item) => (
                      <motion.button
                        key={item.val}
                        variants={pillVariants}
                        animate={sugarLevel === item.val ? "selected" : "unselected"}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setSugarLevel(item.val)}
                        className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs transition-colors ${
                          sugarLevel === item.val
                            ? 'border-[#C85A32] text-[#C85A32] shadow-sm shadow-[#C85A32]/15'
                            : 'border-[#EFE9E2] text-[#2C221E] hover:border-[#C85A32]/40'
                        }`}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Milk */}
                {menu.is_milk_based && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EFE9E2]"
                  >
                    <label className="block font-brand font-bold text-xs text-[#2C221E] mb-2.5">
                      Pilihan Susu (Milk Base)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Fresh Milk', extra: 0 },
                        { label: 'Oat Milk (+5k)', extra: 5000 },
                        { label: 'Almond (+5k)', extra: 5000 }
                      ].map((item) => (
                        <motion.button
                          key={item.label}
                          variants={pillVariants}
                          animate={milkType === item.label ? "selected" : "unselected"}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleMilkChange(item.label, item.extra)}
                          className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs transition-colors ${
                            milkType === item.label
                              ? 'border-[#C85A32] text-[#C85A32] shadow-sm shadow-[#C85A32]/15'
                              : 'border-[#EFE9E2] text-[#2C221E] hover:border-[#C85A32]/40'
                          }`}
                        >
                          {item.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Food Options */}
            {!menu.is_beverage && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EFE9E2]"
              >
                <label className="block font-brand font-bold text-xs text-[#2C221E] mb-2.5">
                  Penyajian Pastry & Makanan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Hangatkan (Warmed)', 'Suhu Ruangan'].map((option) => (
                    <motion.button
                      key={option}
                      variants={pillVariants}
                      animate={warmOption === option ? "selected" : "unselected"}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setWarmOption(option)}
                      className={`py-2.5 px-3 rounded-xl border-2 font-brand font-bold text-xs transition-colors ${
                        warmOption === option
                          ? 'border-[#C85A32] text-[#C85A32] shadow-sm shadow-[#C85A32]/15'
                          : 'border-[#EFE9E2] text-[#2C221E] hover:border-[#C85A32]/40'
                      }`}
                    >
                      {option.replace(' (Warmed)', '')}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block font-brand font-bold text-xs text-[#7E746F] mb-1.5">
                Catatan Khusus (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cth: Pisahkan sedotan, less ice ya..."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#EFE9E2] focus:border-[#C85A32] focus:shadow-md focus:shadow-[#C85A32]/10 text-xs font-brand outline-none transition-all duration-300"
              />
            </motion.div>
          </motion.div>

          {/* Action Bar Footer */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-gradient-to-t from-slate-50 to-white border-t border-[#EFE9E2] flex items-center justify-between gap-3"
          >
            <div className="flex items-center bg-[#FAF7F2] border border-[#EFE9E2] rounded-full px-3 py-1.5 gap-3">
              <motion.button
                whileTap={{ scale: 0.75 }}
                whileHover={{ backgroundColor: "rgba(200,90,50,0.1)" }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-full bg-white text-[#2C221E] font-bold flex items-center justify-center shadow-xs transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              
              <AnimatePresence mode="wait">
                <motion.span 
                  key={quantity}
                  initial={{ y: -10, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 10, opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="font-mono font-bold text-sm text-[#2C221E] w-4 text-center"
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.75 }}
                whileHover={{ backgroundColor: "rgba(200,90,50,0.1)" }}
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-full bg-white text-[#2C221E] font-bold flex items-center justify-center shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(200,90,50,0.35)" }}
              whileTap={{ scale: 0.94 }}
              onClick={handleConfirm}
              className={`flex-1 text-white font-brand font-extrabold py-3 px-5 rounded-2xl flex items-center justify-between shadow-lg shadow-[#C85A32]/25 btn-premium transition-all duration-300 ${
                addedAnimation ? 'bg-green-500' : 'bg-[#C85A32] hover:bg-[#A44321]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                {addedAnimation ? 'Ditambahkan! ✓' : 'Masukkan'}
              </span>
              <motion.span 
                key={totalPrice}
                initial={{ scale: 1.15, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/20 text-white font-mono text-xs px-3 py-1 rounded-full backdrop-blur-sm"
              >
                Rp {formatRupiah(totalPrice)}
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
