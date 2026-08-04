import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

export default function CartFloatingBar({ cart, onOpenCheckout }) {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

  if (totalQty === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.85 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        whileHover={{ scale: 1.02, y: -3 }}
        whileTap={{ scale: 0.97 }}
        onClick={onOpenCheckout}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-gradient-to-r from-[#2C221E] via-[#3D2D27] to-[#2C221E] text-white rounded-3xl p-3.5 px-5 flex items-center justify-between z-40 border border-white/10 cursor-pointer cart-glow btn-premium"
      >
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <motion.div 
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C85A32] to-[#E8703E] flex items-center justify-center shadow-lg shadow-[#C85A32]/50"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </motion.div>
            <motion.span 
              key={totalQty}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-2 -right-2 bg-amber-400 text-[#2C221E] font-mono font-bold text-[11px] w-6 h-6 rounded-full flex items-center justify-center shadow-md shadow-amber-400/40 border-2 border-[#2C221E]"
            >
              {totalQty}
            </motion.span>
          </div>

          <div>
            <span className="text-[11px] text-white/55 block leading-tight">Total Pesanan</span>
            <motion.span 
              key={totalPrice}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-brand font-extrabold text-sm text-white"
            >
              Rp {formatRupiah(totalPrice)}
            </motion.span>
          </div>
        </div>

        <motion.div 
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-1 text-amber-400 font-brand font-bold text-xs"
        >
          <span>Checkout</span>
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
