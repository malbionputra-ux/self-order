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
        initial={{ y: 100, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        onClick={onOpenCheckout}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md glass-panel rounded-2xl p-3.5 px-5 flex items-center justify-between z-40 cursor-pointer glow-accent btn-fast"
      >
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E8703E] to-[#C85A32] flex items-center justify-center shadow-lg shadow-[#E8703E]/30">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <motion.span
              key={totalQty}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-2 -right-2 bg-amber-400 text-[#0D0B0A] font-mono font-bold text-[11px] w-5.5 h-5.5 rounded-full flex items-center justify-center shadow-md border-2 border-[#0D0B0A]"
            >
              {totalQty}
            </motion.span>
          </div>

          <div>
            <span className="text-[10px] text-[#6B5F56] block leading-tight font-brand">Total Pesanan</span>
            <motion.span
              key={totalPrice}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-brand font-extrabold text-sm text-[#F5F0EB]"
            >
              Rp {formatRupiah(totalPrice)}
            </motion.span>
          </div>
        </div>

        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-1 text-[#E8703E] font-brand font-bold text-xs"
        >
          <span>Checkout</span>
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
