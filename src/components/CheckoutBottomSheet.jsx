import React, { useState } from 'react';
import { X, Receipt, User, QrCode, Banknote, CreditCard, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

export default function CheckoutBottomSheet({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQty, 
  tableNumber, 
  onSubmitOrder 
}) {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const taxAmount = Math.round(rawSubtotal * 0.10);
  const totalPrice = rawSubtotal + taxAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Masukkan nama pemesan terlebih dahulu.');
      return;
    }
    onSubmitOrder({
      table_number: tableNumber,
      customer_name: customerName,
      payment_method: paymentMethod,
      items: cart,
      rawSubtotal,
      taxAmount,
      totalPrice
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-md">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="bg-white rounded-t-3xl overflow-hidden w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#EFE9E2] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-[#2C221E]">
              <Receipt className="w-5 h-5 text-[#C85A32]" />
              <span>Ringkasan Pesanan</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 text-[#2C221E] flex items-center justify-center hover:bg-[#C85A32] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#2C221E] mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#C85A32]" /> Nama Pemesan
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama kamu..."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#EFE9E2] focus:border-[#C85A32] focus:shadow-md focus:shadow-[#C85A32]/10 text-xs font-brand outline-none transition-all"
              />
            </div>

            {/* Cart Items List */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#2C221E] mb-2">
                Item Pesanan
              </label>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {cart.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EFE9E2] flex items-center justify-between"
                  >
                    <div className="flex-1 pr-2">
                      <h4 className="font-brand font-extrabold text-xs text-[#2C221E]">
                        {item.menu.name}
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.customizations?.ice && (
                          <span className="bg-white text-[10px] px-2 py-0.5 rounded-md border border-[#EFE9E2] text-[#7E746F] font-brand">
                            {item.customizations.ice}
                          </span>
                        )}
                        {item.customizations?.sugar && (
                          <span className="bg-white text-[10px] px-2 py-0.5 rounded-md border border-[#EFE9E2] text-[#7E746F] font-brand">
                            {item.customizations.sugar}
                          </span>
                        )}
                        {item.customizations?.milk && (
                          <span className="bg-white text-[10px] px-2 py-0.5 rounded-md border border-[#EFE9E2] text-[#7E746F] font-brand">
                            {item.customizations.milk}
                          </span>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-[10px] text-[#7E746F] italic mt-1">
                          Note: {item.notes}
                        </p>
                      )}
                      <span className="font-brand font-extrabold text-xs text-[#C85A32] block mt-1">
                        Rp {formatRupiah(item.unit_price)}
                      </span>
                    </div>

                    <div className="flex items-center bg-white border border-[#EFE9E2] rounded-full px-2 py-0.5 gap-2 shadow-xs">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        type="button"
                        onClick={() => onUpdateQty(index, -1)}
                        className="w-6 h-6 rounded-full text-[#2C221E] font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </motion.button>
                      <span className="font-mono font-bold text-xs text-[#2C221E] w-3 text-center">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        type="button"
                        onClick={() => onUpdateQty(index, 1)}
                        className="w-6 h-6 rounded-full text-[#2C221E] font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Payment Method Options */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#2C221E] mb-2">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'qris'
                      ? 'border-[#C85A32] bg-[#FDF5F0] text-[#C85A32] shadow-sm'
                      : 'border-[#EFE9E2] bg-white text-[#2C221E] hover:border-[#C85A32]/40'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#C85A32]" />
                  <span className="text-[11px]">QRIS Instant</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => setPaymentMethod('va')}
                  className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'va'
                      ? 'border-[#C85A32] bg-[#FDF5F0] text-[#C85A32] shadow-sm'
                      : 'border-[#EFE9E2] bg-white text-[#2C221E] hover:border-[#C85A32]/40'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C85A32]" />
                  <span className="text-[11px]">BCA VA</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => setPaymentMethod('kasir')}
                  className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === 'kasir'
                      ? 'border-[#C85A32] bg-[#FDF5F0] text-[#C85A32] shadow-sm'
                      : 'border-[#EFE9E2] bg-white text-[#2C221E] hover:border-[#C85A32]/40'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-[#C85A32]" />
                  <span className="text-[11px]">Bayar Kasir</span>
                </motion.button>
              </div>
            </div>

            {/* Total Calculations Card */}
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EFE9E2] space-y-1.5 font-brand text-xs">
              <div className="flex justify-between text-[#7E746F]">
                <span>Subtotal Menu</span>
                <span className="font-mono font-bold text-[#2C221E]">Rp {formatRupiah(rawSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#7E746F]">
                <span>Pajak PB1 Resto (10%)</span>
                <span className="font-mono font-bold text-[#2C221E]">Rp {formatRupiah(taxAmount)}</span>
              </div>
              <hr className="border-[#EFE9E2] my-1" />
              <div className="flex justify-between font-extrabold text-sm text-[#2C221E] pt-1">
                <span>Total Pembayaran</span>
                <span className="font-brand text-base text-[#C85A32]">Rp {formatRupiah(totalPrice)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#C85A32]/25 tracking-wide uppercase text-xs btn-premium"
            >
              <CheckCircle2 className="w-4 h-4" /> Lanjut Ke Pembayaran
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
