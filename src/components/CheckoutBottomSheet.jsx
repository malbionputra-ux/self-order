import React, { useState } from 'react';
import { X, Receipt, User, QrCode, Banknote, CreditCard, Minus, Plus, CheckCircle2, Tag, Check, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

const PROMO_CODES = {
  'KIRI10': { type: 'percent', value: 10, label: 'Diskon 10% (Promo Kiri)' },
  'KIRICOFFEE': { type: 'flat', value: 10000, label: 'Potongan Rp 10.000' },
  'DISKON20': { type: 'percent', value: 20, label: 'Diskon 20% Member' }
};

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
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo.type === 'percent') {
      discountAmount = Math.round((rawSubtotal * promo.value) / 100);
    } else {
      discountAmount = Math.min(rawSubtotal, promo.value);
    }
  }

  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);
  const taxAmount = Math.round(subtotalAfterDiscount * 0.10);
  const totalPrice = subtotalAfterDiscount + taxAmount;

  const handleApplyPromo = (codeToApply) => {
    const code = (codeToApply || promoInput).toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
      setPromoInput(code);
    } else {
      setPromoError('Kode promo tidak valid! Coba KIRI10 / KIRICOFFEE');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

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
      appliedPromo,
      promoLabel: appliedPromo ? PROMO_CODES[appliedPromo].label : null,
      discountAmount,
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
            <button
              onClick={onClose}
              className="btn-fast w-8 h-8 rounded-full bg-slate-200/70 text-[#2C221E] flex items-center justify-center hover:bg-[#C85A32] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
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
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#EFE9E2] focus:border-[#C85A32] focus:shadow-md text-xs font-brand outline-none transition-all"
              />
            </div>

            {/* Cart Items List */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#2C221E] mb-2">
                Item Pesanan
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {cart.map((item, index) => (
                  <div 
                    key={index}
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
                      <button
                        type="button"
                        onClick={() => onUpdateQty(index, -1)}
                        className="btn-fast w-6 h-6 rounded-full text-[#2C221E] font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs text-[#2C221E] w-3 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(index, 1)}
                        className="btn-fast w-6 h-6 rounded-full text-[#2C221E] font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code & Voucher Section */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EFE9E2] space-y-2">
              <label className="block font-brand font-bold text-xs text-[#2C221E] flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#C85A32]" /> Kode Promo / Diskon
              </label>

              {appliedPromo ? (
                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-brand font-extrabold text-xs text-emerald-800 uppercase block">
                        {appliedPromo}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-brand">
                        {PROMO_CODES[appliedPromo].label} (-Rp {formatRupiah(discountAmount)})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs font-brand text-red-500 font-bold hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Cth: KIRI10 / KIRICOFFEE"
                      className="flex-1 px-3 py-2 rounded-xl border border-[#EFE9E2] bg-white text-xs font-brand outline-none focus:border-[#C85A32]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      className="bg-[#C85A32] text-white font-brand font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#A44321] transition-colors btn-fast"
                    >
                      Terapkan
                    </button>
                  </div>

                  {promoError && (
                    <p className="text-[10px] text-red-500 font-brand">{promoError}</p>
                  )}

                  {/* Available Quick Voucher Tags */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-[#7E746F] font-brand">Gunakan:</span>
                    {Object.keys(PROMO_CODES).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleApplyPromo(code)}
                        className="text-[10px] font-brand font-bold bg-white text-[#C85A32] px-2 py-0.5 rounded-md border border-[#C85A32]/30 hover:bg-[#C85A32] hover:text-white transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Options (4 Options) */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#2C221E] mb-2">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                    paymentMethod === 'qris'
                      ? 'border-[#C85A32] bg-[#FDF5F0] text-[#C85A32] shadow-xs'
                      : 'border-[#EFE9E2] bg-white text-[#2C221E] hover:border-[#C85A32]/40'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#C85A32]" />
                  <span>QRIS / Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                    paymentMethod === 'card'
                      ? 'border-[#C85A32] bg-[#FDF5F0] text-[#C85A32] shadow-xs'
                      : 'border-[#EFE9E2] bg-white text-[#2C221E] hover:border-[#C85A32]/40'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C85A32]" />
                  <span>Debit / Kredit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('va')}
                  className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                    paymentMethod === 'va'
                      ? 'border-[#C85A32] bg-[#FDF5F0] text-[#C85A32] shadow-xs'
                      : 'border-[#EFE9E2] bg-white text-[#2C221E] hover:border-[#C85A32]/40'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C85A32]" />
                  <span>BCA VA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('kasir')}
                  className={`py-2.5 px-2 rounded-xl border-2 font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                    paymentMethod === 'kasir'
                      ? 'border-[#C85A32] bg-[#FDF5F0] text-[#C85A32] shadow-xs'
                      : 'border-[#EFE9E2] bg-white text-[#2C221E] hover:border-[#C85A32]/40'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-[#C85A32]" />
                  <span>Bayar Kasir</span>
                </button>
              </div>
            </div>

            {/* Total Calculations Card */}
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EFE9E2] space-y-1.5 font-brand text-xs">
              <div className="flex justify-between text-[#7E746F]">
                <span>Subtotal Menu</span>
                <span className="font-mono font-bold text-[#2C221E]">Rp {formatRupiah(rawSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon Promo ({appliedPromo})</span>
                  <span className="font-mono">-Rp {formatRupiah(discountAmount)}</span>
                </div>
              )}

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
            <button
              type="submit"
              className="btn-fast w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#C85A32]/25 tracking-wide uppercase text-xs"
            >
              <CheckCircle2 className="w-4 h-4" /> Lanjut Ke Pembayaran
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
