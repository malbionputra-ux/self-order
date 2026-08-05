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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl border-none relative overflow-hidden"
        >
          {/* Top Decorative Header Icon */}
          <div className="w-14 h-14 rounded-full bg-[#FDF5F0] border-none mx-auto mb-3 flex items-center justify-center text-[#C85A32] shadow-sm">
            <Coffee className="w-7 h-7" />
          </div>

          <h3 className="font-display font-extrabold text-lg text-[#1C1917] mb-1">
            Selamat Datang di Dump Cafe!
          </h3>
          <p className="text-xs text-[#78716C] mb-4 leading-relaxed font-brand font-medium">
            Masukkan nomor meja tempat Anda bersantai untuk mulai memesan menu favorit.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-brand font-extrabold uppercase text-[#78716C] mb-1.5 tracking-wider">
                NOMOR MEJA DUDUK
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-[#C85A32] absolute left-3.5" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={inputTable}
                  onChange={(e) => setInputTable(e.target.value)}
                  placeholder="Cth: 08"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-[#C85A32]/30 text-center font-mono font-extrabold text-lg text-[#1C1917] outline-none transition-colors bg-[#FAF7F2]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-fast w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#C85A32]/20 uppercase tracking-wider text-xs border-none"
            >
              <span>Mulai Pilih Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
