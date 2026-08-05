import React, { useState } from 'react';
import { X, Receipt, User, QrCode, Banknote, CreditCard, Minus, Plus, CheckCircle2, Tag, Check, Users, Scissors, DollarSign, ListChecks } from 'lucide-react';
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

  // Split Bill / Partial Payment State
  const [isSplitBill, setIsSplitBill] = useState(false);
  const [splitMode, setSplitMode] = useState('equal'); // 'equal' | 'custom' | 'item'
  const [splitPeopleCount, setSplitPeopleCount] = useState(2);
  const [customPayAmount, setCustomPayAmount] = useState('');
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);

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
  const fullTotalPrice = subtotalAfterDiscount + taxAmount;

  // Split Bill Calculations
  let currentPayAmount = fullTotalPrice;
  let remainingBalance = 0;

  if (isSplitBill) {
    if (splitMode === 'equal') {
      currentPayAmount = Math.round(fullTotalPrice / splitPeopleCount);
      remainingBalance = fullTotalPrice - currentPayAmount;
    } else if (splitMode === 'custom') {
      const parsedCustom = parseInt(customPayAmount.replace(/[^0-9]/g, ''), 10) || 0;
      currentPayAmount = Math.min(fullTotalPrice, Math.max(1000, parsedCustom));
      remainingBalance = Math.max(0, fullTotalPrice - currentPayAmount);
    } else if (splitMode === 'item') {
      const selectedItemsSubtotal = cart
        .filter(item => selectedItemKeys.includes(item.key))
        .reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
      const ratio = rawSubtotal > 0 ? selectedItemsSubtotal / rawSubtotal : 1;
      const itemTax = Math.round(selectedItemsSubtotal * 0.10);
      const itemDiscount = Math.round(discountAmount * ratio);
      currentPayAmount = Math.max(0, selectedItemsSubtotal - itemDiscount + itemTax);
      remainingBalance = Math.max(0, fullTotalPrice - currentPayAmount);
    }
  }

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

  const toggleSelectItem = (key) => {
    setSelectedItemKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('Masukkan nama pemesan terlebih dahulu.');
      return;
    }
    if (isSplitBill && splitMode === 'item' && selectedItemKeys.length === 0) {
      alert('Pilih minimal 1 item untuk dibayar.');
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
      fullTotalPrice,
      totalPrice: currentPayAmount, // Amount paying now
      isSplitBill,
      splitDetails: isSplitBill ? {
        mode: splitMode,
        peopleCount: splitPeopleCount,
        currentPayAmount,
        remainingBalance
      } : null
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
          className="bg-[#0D0B0A] rounded-t-3xl overflow-hidden w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl border-t border-x border-white/[0.06]"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-[#1A1614]">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-[#F5F0EB]">
              <Receipt className="w-5 h-5 text-[#E8703E]" />
              <span>Ringkasan Pesanan</span>
            </div>
            <button
              onClick={onClose}
              className="btn-fast w-8 h-8 rounded-full bg-white/[0.06] text-[#F5F0EB] flex items-center justify-center hover:bg-[#E8703E] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 space-y-4">
            {/* Customer Name */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#F5F0EB] mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#E8703E]" /> Nama Pemesan
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama kamu..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-[#E8703E]/40 text-xs font-brand outline-none transition-all bg-white/[0.04] text-[#F5F0EB] placeholder-[#6B5F56]"
              />
            </div>

            {/* Split Bill Toggle Bar */}
            <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#E8703E] text-white flex items-center justify-center">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-brand font-extrabold text-xs text-[#F5F0EB] block">
                      Split Bill / Bayar Sebagian
                    </span>
                    <span className="text-[10px] text-[#6B5F56]">Bagi tagihan dengan teman di meja</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSplitBill(!isSplitBill)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isSplitBill ? 'bg-[#E8703E]' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isSplitBill ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Split Options Panel */}
              {isSplitBill && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-3 animate-fade-in">
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSplitMode('equal')}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-brand font-bold flex items-center justify-center gap-1 border transition-all btn-fast ${
                        splitMode === 'equal'
                          ? 'bg-[#E8703E] text-white border-[#E8703E]'
                          : 'bg-white/[0.04] text-[#9A8E85] border-white/[0.06]'
                      }`}
                    >
                      <Users className="w-3 h-3" /> Bagi Rata
                    </button>

                    <button
                      type="button"
                      onClick={() => setSplitMode('custom')}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-brand font-bold flex items-center justify-center gap-1 border transition-all btn-fast ${
                        splitMode === 'custom'
                          ? 'bg-[#E8703E] text-white border-[#E8703E]'
                          : 'bg-white/[0.04] text-[#9A8E85] border-white/[0.06]'
                      }`}
                    >
                      <DollarSign className="w-3 h-3" /> Nominal Custom
                    </button>

                    <button
                      type="button"
                      onClick={() => setSplitMode('item')}
                      className={`py-1.5 px-2 rounded-xl text-[10px] font-brand font-bold flex items-center justify-center gap-1 border transition-all btn-fast ${
                        splitMode === 'item'
                          ? 'bg-[#E8703E] text-white border-[#E8703E]'
                          : 'bg-white/[0.04] text-[#9A8E85] border-white/[0.06]'
                      }`}
                    >
                      <ListChecks className="w-3 h-3" /> Per Item
                    </button>
                  </div>

                  {splitMode === 'equal' && (
                    <div className="flex items-center justify-between bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.06]">
                      <span className="text-xs font-brand text-[#6B5F56]">Jumlah Orang:</span>
                      <div className="flex items-center gap-2">
                        {[2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setSplitPeopleCount(num)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-colors ${
                              splitPeopleCount === num
                                ? 'bg-[#E8703E] text-white'
                                : 'bg-white/[0.05] text-[#9A8E85] hover:bg-white/10'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {splitMode === 'custom' && (
                    <div>
                      <label className="text-[10px] text-[#6B5F56] block font-brand mb-1">
                        Masukkan Nominal Yang Ingin Anda Bayar:
                      </label>
                      <input
                        type="text"
                        value={customPayAmount}
                        onChange={(e) => setCustomPayAmount(e.target.value)}
                        placeholder={`Cth: ${formatRupiah(Math.round(fullTotalPrice / 2))}`}
                        className="w-full px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-xs font-mono font-bold outline-none focus:border-[#E8703E]/40 text-[#F5F0EB] placeholder-[#6B5F56]"
                      />
                    </div>
                  )}

                  {splitMode === 'item' && (
                    <p className="text-[10px] text-[#E8703E] font-brand font-bold">
                      Centang item di bawah yang ingin Anda bayar sekarang ⬇️
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#F5F0EB] mb-2">
                Item Pesanan
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {cart.map((item, index) => {
                  const isSelectedForSplit = selectedItemKeys.includes(item.key);
                  return (
                    <div 
                      key={index}
                      onClick={() => isSplitBill && splitMode === 'item' && toggleSelectItem(item.key)}
                      className={`p-3 rounded-2xl border transition-all ${
                        isSplitBill && splitMode === 'item' && isSelectedForSplit
                          ? 'bg-[#E8703E]/10 border-[#E8703E]/40 shadow-xs cursor-pointer'
                          : 'bg-white/[0.03] border-white/[0.06]'
                      } flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-2 flex-1 pr-2">
                        {isSplitBill && splitMode === 'item' && (
                          <input
                            type="checkbox"
                            checked={isSelectedForSplit}
                            onChange={() => toggleSelectItem(item.key)}
                            className="w-4 h-4 accent-[#E8703E]"
                          />
                        )}
                        <div>
                          <h4 className="font-brand font-extrabold text-xs text-[#F5F0EB]">
                            {item.menu.name}
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.customizations?.ice && (
                              <span className="bg-[#0D0B0A] text-[10px] px-2 py-0.5 rounded-md border border-white/[0.08] text-[#8C8279] font-brand">
                                {item.customizations.ice}
                              </span>
                            )}
                            {item.customizations?.milk && (
                              <span className="bg-white/[0.05] text-[10px] px-2 py-0.5 rounded-md border border-white/[0.06] text-[#6B5F56] font-brand">
                                {item.customizations.milk}
                              </span>
                            )}
                          </div>
                          <span className="font-brand font-extrabold text-xs text-[#E8703E] block mt-1">
                            Rp {formatRupiah(item.unit_price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center bg-white/[0.05] border border-white/[0.06] rounded-full px-2 py-0.5 gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onUpdateQty(index, -1); }}
                          className="btn-fast w-6 h-6 rounded-full text-[#F5F0EB] font-bold text-xs flex items-center justify-center hover:bg-white/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs text-[#F5F0EB] w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onUpdateQty(index, 1); }}
                          className="btn-fast w-6 h-6 rounded-full text-[#F5F0EB] font-bold text-xs flex items-center justify-center hover:bg-white/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Promo Code & Voucher Section */}
            <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.06] space-y-2">
              <label className="block font-brand font-bold text-xs text-[#F5F0EB] flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#E8703E]" /> Kode Promo / Diskon
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
                      className="flex-1 px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] text-xs font-brand outline-none focus:border-[#E8703E]/40 text-[#F5F0EB] placeholder-[#6B5F56]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      className="bg-[#E8703E] text-white font-brand font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#C85A32] transition-colors btn-fast"
                    >
                      Terapkan
                    </button>
                  </div>

                  {promoError && (
                    <p className="text-[10px] text-red-500 font-brand">{promoError}</p>
                  )}

                  {/* Quick Voucher Tags */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-[#6B5F56] font-brand">Gunakan:</span>
                    {Object.keys(PROMO_CODES).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleApplyPromo(code)}
                        className="text-[10px] font-brand font-bold bg-white/[0.05] text-[#E8703E] px-2 py-0.5 rounded-md border border-[#E8703E]/20 hover:bg-[#E8703E] hover:text-white transition-colors"
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
              <label className="block font-brand font-bold text-xs text-[#F5F0EB] mb-2">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2.5 px-2 rounded-xl border font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                    paymentMethod === 'qris'
                      ? 'border-[#E8703E]/50 bg-[#E8703E]/10 text-[#FF9E79]'
                      : 'border-white/[0.06] bg-white/[0.03] text-[#9A8E85] hover:border-[#E8703E]/30'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#E8703E]" />
                  <span>QRIS / Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-2 rounded-xl border font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                    paymentMethod === 'card'
                      ? 'border-[#E8703E]/50 bg-[#E8703E]/10 text-[#FF9E79]'
                      : 'border-white/[0.06] bg-white/[0.03] text-[#9A8E85] hover:border-[#E8703E]/30'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#E8703E]" />
                  <span>Debit / Kredit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('va')}
                  className={`py-2.5 px-2 rounded-xl border font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                    paymentMethod === 'va'
                      ? 'border-[#E8703E]/50 bg-[#E8703E]/10 text-[#FF9E79]'
                      : 'border-white/[0.06] bg-white/[0.03] text-[#9A8E85] hover:border-[#E8703E]/30'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#E8703E]" />
                  <span>BCA VA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('kasir')}
                  className={`py-2.5 px-2 rounded-xl border font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast ${
                    paymentMethod === 'kasir'
                      ? 'border-[#E8703E]/50 bg-[#E8703E]/10 text-[#FF9E79]'
                      : 'border-white/[0.06] bg-white/[0.03] text-[#9A8E85] hover:border-[#E8703E]/30'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-[#E8703E]" />
                  <span>Bayar Kasir</span>
                </button>
              </div>
            </div>

            {/* Total Calculations Card */}
            <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/[0.06] space-y-1.5 font-brand text-xs">
              <div className="flex justify-between text-[#6B5F56]">
                <span>Total Tagihan Meja #{tableNumber}</span>
                <span className="font-mono font-bold text-[#F5F0EB]">Rp {formatRupiah(fullTotalPrice)}</span>
              </div>

              {isSplitBill && (
                <>
                  <div className="flex justify-between text-[#E8703E] font-bold">
                    <span>Split Bill ({splitMode === 'equal' ? `Bagi ${splitPeopleCount} Orang` : splitMode === 'item' ? 'Per Item' : 'Nominal Custom'})</span>
                    <span className="font-mono">Rp {formatRupiah(currentPayAmount)}</span>
                  </div>
                  {remainingBalance > 0 && (
                    <div className="flex justify-between text-[#6B5F56] text-[11px]">
                      <span>Sisa Tagihan Meja</span>
                      <span className="font-mono">Rp {formatRupiah(remainingBalance)}</span>
                    </div>
                  )}
                </>
              )}

              <hr className="border-white/[0.06] my-1" />
              
              <div className="flex justify-between font-extrabold text-sm text-[#F5F0EB] pt-1">
                <span>{isSplitBill ? 'Dibayar Sekarang' : 'Total Pembayaran'}</span>
                <span className="font-brand text-base text-[#E8703E]">Rp {formatRupiah(currentPayAmount)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-cta w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] text-white font-brand font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#E8703E]/25 tracking-wide uppercase text-xs"
            >
              <CheckCircle2 className="w-4 h-4 relative z-10" /> <span className="relative z-10">{isSplitBill ? `Bayar Bagian Anda (Rp ${formatRupiah(currentPayAmount)})` : 'Lanjut Ke Pembayaran'}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
