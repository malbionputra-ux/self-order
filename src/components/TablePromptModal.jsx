import React, { useState } from 'react';
import { CupSoda, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TablePromptModal({ isOpen, currentTable, onSave }) {
  const [val, setVal] = useState(currentTable || '08');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(val || '08');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl border border-[#EFE9E2]"
        >
          <div className="w-16 h-16 rounded-full bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center mx-auto mb-3">
            <CupSoda className="w-8 h-8 text-[#C85A32]" />
          </div>

          <h3 className="font-serif font-bold text-lg text-[#2C221E] mb-1">
            Selamat Datang di Kiri Coffee!
          </h3>
          <p className="text-xs text-[#7E746F] mb-4 leading-relaxed">
            Masukkan nomor meja tempat Anda bersantai untuk mulai memesan menu favorit.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-brand font-bold text-[11px] text-[#7E746F] mb-1 uppercase tracking-wider">
                NOMOR MEJA DUDUK
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="Cth: 08"
                className="w-full text-center font-mono font-bold text-2xl py-2.5 rounded-2xl border-2 border-[#EFE9E2] focus:border-[#C85A32] text-[#2C221E] outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              type="submit"
              className="w-full bg-[#C85A32] hover:bg-[#A44321] text-white font-brand font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#C85A32]/25 tracking-wide uppercase text-xs"
            >
              Mulai Pilih Menu <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
