import React, { useState, useEffect } from 'react';
import { MapPin, Coffee, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TablePromptModal({ isOpen, currentTable, onSave }) {
  const [inputTable, setInputTable] = useState(currentTable || '');

  useEffect(() => {
    setInputTable(currentTable || '');
  }, [currentTable]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputTable.trim()) {
      onSave(inputTable.trim());
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="glass-card rounded-[28px] p-6 w-full max-w-sm text-center relative overflow-hidden"
        >
          {/* Aurora Ambient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8703E]/10 rounded-full blur-[40px] animate-aurora pointer-events-none" />

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-[#E8703E]/10 border border-[#E8703E]/20 mx-auto mb-4 flex items-center justify-center">
            <Coffee className="w-7 h-7 text-[#E8703E]" />
          </div>

          <h3 className="font-serif text-lg text-[#F5F0EB] mb-1">
            Selamat Datang!
          </h3>
          <p className="text-xs text-[#9A8E85] mb-5 leading-relaxed font-brand">
            Masukkan nomor meja tempat Anda bersantai untuk mulai memesan menu favorit.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-brand font-bold uppercase text-[#6B5F56] mb-1.5 tracking-wider">
                Nomor Meja
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-[#E8703E] absolute left-3.5" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={inputTable}
                  onChange={(e) => setInputTable(e.target.value)}
                  placeholder="Cth: 08"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/[0.08] focus:border-[#E8703E]/40 text-center font-mono font-extrabold text-lg text-[#F5F0EB] outline-none transition-colors bg-white/[0.04]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-cta w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] text-white font-brand font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#E8703E]/25 uppercase tracking-wider text-xs"
            >
              <span className="relative z-10">Mulai Pilih Menu</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
