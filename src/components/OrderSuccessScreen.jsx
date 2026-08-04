import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Flame, CupSoda, PlusCircle, Receipt, PartyPopper } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

// Confetti particle component
function ConfettiParticle({ delay, color, left }) {
  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{ y: '100vh', x: [0, 15, -10, 20], opacity: 0, rotate: 720 }}
      transition={{ duration: 3 + Math.random() * 2, delay, ease: "easeIn" }}
      className="absolute top-0 w-2 h-2 rounded-full pointer-events-none"
      style={{ left: `${left}%`, backgroundColor: color }}
    />
  );
}

const confettiColors = ['#C85A32', '#FFB396', '#FBBF24', '#F87171', '#60A5FA', '#34D399', '#A78BFA'];

export default function OrderSuccessScreen({ order, onNewOrder }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!order) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-5 text-center min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#FDF5F0] to-[#FAF7F2] flex flex-col justify-between relative overflow-hidden"
    >
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 0.1}
              color={confettiColors[i % confettiColors.length]}
              left={Math.random() * 100}
            />
          ))}
        </div>
      )}

      <div className="relative z-20">
        {/* Success Animated Icon */}
        <div className="my-8 flex justify-center relative">
          {/* Expanding rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-2 border-[#C85A32]/20 success-ring" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-36 h-36 rounded-full bg-[#C85A32]"
            />
          </div>
          
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C85A32] to-[#E8703E] flex items-center justify-center shadow-xl shadow-[#C85A32]/30 relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
            >
              <CheckCircle2 className="w-14 h-14 text-white" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="font-serif font-bold text-xl text-[#2C221E] mb-1.5 flex items-center justify-center gap-2">
            Pesanan Berhasil Dibuat!
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5, delay: 1, repeat: 2 }}
            >
              🎉
            </motion.span>
          </h1>
          <p className="text-xs text-[#7E746F] mb-6">
            Pesanan Anda telah diterima barista & bar kitchen Kiri Coffee.
          </p>
        </motion.div>

        {/* Barista Status Monitoring */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          className="bg-white p-4 rounded-3xl border border-[#EFE9E2] text-left mb-5 shadow-sm"
        >
          <span className="font-brand font-bold text-[11px] text-[#7E746F] block mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C85A32]" /> STATUS MONITORING BARISTA
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-brand font-bold">
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-[#C85A32] text-white py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-sm shadow-[#C85A32]/20"
            >
              <Clock className="w-3 h-3" /> Diterima
            </motion.span>
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="bg-[#C85A32] text-white py-2.5 rounded-xl flex items-center justify-center gap-1 shadow-sm shadow-[#C85A32]/20"
            >
              <Flame className="w-3 h-3" /> Diseduh
            </motion.span>
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="bg-[#EFE9E2] text-[#7E746F] py-2.5 rounded-xl flex items-center justify-center gap-1"
            >
              <CupSoda className="w-3 h-3" /> Disajikan
            </motion.span>
          </div>
        </motion.div>

        {/* Receipt Detail */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 180 }}
          className="bg-white rounded-3xl border border-[#EFE9E2] text-left shadow-md overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-[#2C221E] to-[#3D2D27] p-4 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] text-white/55 block font-brand uppercase">ID PESANAN</span>
              <span className="font-mono font-bold text-sm">#{String(order.id || 101).padStart(5, '0')}</span>
            </div>
            <motion.span 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-amber-400 text-[#2C221E] font-brand font-extrabold text-xs px-3 py-1 rounded-full shadow-sm"
            >
              MEJA #{order.table_number}
            </motion.span>
          </div>

          <div className="p-4 space-y-4 font-brand text-xs">
            <div className="grid grid-cols-2 pb-3 border-b border-[#EFE9E2] text-xs">
              <div>
                <span className="text-[#7E746F] block">Nama Pemesan:</span>
                <strong className="text-[#2C221E]">{order.customer_name}</strong>
              </div>
              <div className="text-right">
                <span className="text-[#7E746F] block">Pembayaran:</span>
                <strong className="uppercase text-[#C85A32]">{order.payment_method}</strong>
              </div>
            </div>

            <div>
              <span className="font-bold text-[#7E746F] block mb-2 text-[11px] uppercase tracking-wide">
                RINCIAN PESANAN
              </span>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + idx * 0.1 }}
                    className="flex justify-between items-center pb-2 border-b border-slate-100"
                  >
                    <div>
                      <div className="font-bold text-[#2C221E]">{item.menu.name} x {item.quantity}</div>
                      <div className="text-[10px] text-[#7E746F] flex gap-1 mt-0.5">
                        {item.customizations?.ice && <span>{item.customizations.ice}</span>}
                        {item.customizations?.milk && <span>• {item.customizations.milk}</span>}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#2C221E]">
                      Rp {formatRupiah(item.unit_price * item.quantity)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EFE9E2] space-y-1">
              <div className="flex justify-between text-[#7E746F]">
                <span>Subtotal Menu</span>
                <span className="font-mono">Rp {formatRupiah(order.rawSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#7E746F]">
                <span>Pajak PB1 Resto (10%)</span>
                <span className="font-mono">Rp {formatRupiah(order.taxAmount)}</span>
              </div>
              <hr className="border-[#EFE9E2] my-1" />
              <div className="flex justify-between font-extrabold text-sm text-[#2C221E]">
                <span>Total Akhir</span>
                <span className="text-[#C85A32]">Rp {formatRupiah(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(200,90,50,0.35)" }}
        whileTap={{ scale: 0.94 }}
        onClick={onNewOrder}
        className="w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#C85A32]/25 tracking-wide uppercase text-xs btn-premium relative z-20"
      >
        <PlusCircle className="w-4 h-4" /> Pesan Menu Lainnya
      </motion.button>
    </motion.div>
  );
}
