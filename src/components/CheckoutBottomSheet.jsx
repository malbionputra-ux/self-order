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
  const [splitMode, setSplitMode] = useState('equal');
  const [splitPeopleCount, setSplitPeopleCount] = useState(2);
  const [customPayAmount, setCustomPayAmount] = useState('');
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  
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
      totalPrice: currentPayAmount,
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
          className="bg-white rounded-t-[32px] overflow-hidden w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl border-none"
        >
          {/* Header */}
          <div className="p-4 border-none flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2 font-display font-extrabold text-base text-[#1C1917]">
              <Receipt className="w-5 h-5 text-[#C85A32]" />
              <span>Ringkasan Pesanan</span>
            </div>
            <button
              onClick={onClose}
              className="btn-fast w-8 h-8 rounded-full bg-slate-200/70 text-[#1C1917] flex items-center justify-center hover:bg-[#C85A32] hover:text-white transition-colors border-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 space-y-4 bg-white">
            {/* Customer Name */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#1C1917] mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#C85A32]" /> Nama Pemesan
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama kamu..."
                className="w-full px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-[#C85A32]/30 text-xs font-brand outline-none transition-all text-[#1C1917] bg-[#FAF7F2]"
              />
            </div>

            {/* Split Bill Toggle Bar */}
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#C85A32] text-white flex items-center justify-center shadow-sm">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-xs text-[#1C1917] block">
                      Split Bill / Bayar Sebagian
                    </span>
                    <span className="text-[10px] text-[#78716C] font-medium">Bagi tagihan dengan teman di meja</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSplitBill(!isSplitBill)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none ${
                    isSplitBill ? 'bg-[#C85A32]' : 'bg-slate-300'
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
                <div className="mt-3 pt-3 border-none space-y-3 animate-fade-in">
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSplitMode('equal')}
                      className={`py-2 px-2 rounded-xl text-[10px] font-brand font-bold flex items-center justify-center gap-1 border-none transition-all btn-fast ${
                        splitMode === 'equal'
                          ? 'bg-[#C85A32] text-white shadow-xs'
                          : 'bg-white text-[#1C1917]'
                      }`}
                    >
                      <Users className="w-3 h-3" /> Bagi Rata
                    </button>

                    <button
                      type="button"
                      onClick={() => setSplitMode('custom')}
                      className={`py-2 px-2 rounded-xl text-[10px] font-brand font-bold flex items-center justify-center gap-1 border-none transition-all btn-fast ${
                        splitMode === 'custom'
                          ? 'bg-[#C85A32] text-white shadow-xs'
                          : 'bg-white text-[#1C1917]'
                      }`}
                    >
                      <DollarSign className="w-3 h-3" /> Nominal Custom
                    </button>

                    <button
                      type="button"
                      onClick={() => setSplitMode('item')}
                      className={`py-2 px-2 rounded-xl text-[10px] font-brand font-bold flex items-center justify-center gap-1 border-none transition-all btn-fast ${
                        splitMode === 'item'
                          ? 'bg-[#C85A32] text-white shadow-xs'
                          : 'bg-white text-[#1C1917]'
                      }`}
                    >
                      <ListChecks className="w-3 h-3" /> Per Item
                    </button>
                  </div>

                  {splitMode === 'equal' && (
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border-none shadow-xs">
                      <span className="text-xs font-brand text-[#78716C]">Jumlah Orang:</span>
                      <div className="flex items-center gap-2">
                        {[2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setSplitPeopleCount(num)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-colors border-none ${
                              splitPeopleCount === num
                                ? 'bg-[#C85A32] text-white'
                                : 'bg-[#FAF7F2] text-[#1C1917] hover:bg-slate-200'
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
                      <label className="text-[10px] text-[#78716C] block font-brand mb-1">
                        Masukkan Nominal Yang Ingin Anda Bayar:
                      </label>
                      <input
                        type="text"
                        value={customPayAmount}
                        onChange={(e) => setCustomPayAmount(e.target.value)}
                        placeholder={`Cth: ${formatRupiah(Math.round(fullTotalPrice / 2))}`}
                        className="w-full px-3 py-2 rounded-xl border-none bg-white text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[#C85A32]/30 text-[#1C1917]"
                      />
                    </div>
                  )}

                  {splitMode === 'item' && (
                    <p className="text-[10px] text-[#C85A32] font-brand font-bold">
                      Centang item di bawah yang ingin Anda bayar sekarang ⬇️
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#1C1917] mb-2">
                Item Pesanan
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {cart.map((item, index) => {
                  const isSelectedForSplit = selectedItemKeys.includes(item.key);
                  return (
                    <div 
                      key={index}
                      onClick={() => isSplitBill && splitMode === 'item' && toggleSelectItem(item.key)}
                      className={`p-3.5 rounded-2xl border-none transition-all ${
                        isSplitBill && splitMode === 'item' && isSelectedForSplit
                          ? 'bg-[#FDF5F0] shadow-sm cursor-pointer'
                          : 'bg-[#FAF7F2]'
                      } flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-2 flex-1 pr-2">
                        {isSplitBill && splitMode === 'item' && (
                          <input
                            type="checkbox"
                            checked={isSelectedForSplit}
                            onChange={() => toggleSelectItem(item.key)}
                            className="w-4 h-4 accent-[#C85A32]"
                          />
                        )}
                        <div>
                          <h4 className="font-display font-extrabold text-xs text-[#1C1917]">
                            {item.menu.name}
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.customizations?.ice && (
                              <span className="bg-white text-[10px] px-2 py-0.5 rounded-md border-none text-[#78716C] font-brand shadow-xs">
                                {item.customizations.ice}
                              </span>
                            )}
                            {item.customizations?.milk && (
                              <span className="bg-white text-[10px] px-2 py-0.5 rounded-md border-none text-[#78716C] font-brand shadow-xs">
                                {item.customizations.milk}
                              </span>
                            )}
                          </div>
                          <span className="font-brand font-extrabold text-xs text-[#C85A32] block mt-1">
                            Rp {formatRupiah(item.unit_price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center bg-white border-none rounded-full px-2 py-0.5 gap-2 shadow-xs">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onUpdateQty(index, -1); }}
                          className="btn-fast w-6 h-6 rounded-full text-[#1C1917] font-bold text-xs flex items-center justify-center hover:bg-slate-100 border-none"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs text-[#1C1917] w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onUpdateQty(index, 1); }}
                          className="btn-fast w-6 h-6 rounded-full text-[#1C1917] font-bold text-xs flex items-center justify-center hover:bg-slate-100 border-none"
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
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border-none space-y-2">
              <label className="block font-brand font-bold text-xs text-[#1C1917] flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#C85A32]" /> Kode Promo / Diskon
              </label>

              {appliedPromo ? (
                <div className="bg-emerald-50 border-none p-2.5 rounded-xl flex items-center justify-between shadow-xs">
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
                    className="text-xs font-brand text-red-500 font-bold hover:underline border-none"
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
                      className="flex-1 px-3 py-2 rounded-xl border-none bg-white text-xs font-brand outline-none focus:ring-2 focus:ring-[#C85A32]/30 text-[#1C1917]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      className="bg-[#C85A32] text-white font-brand font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#A44321] transition-colors btn-fast border-none"
                    >
                      Terapkan
                    </button>
                  </div>

                  {promoError && (
                    <p className="text-[10px] text-red-500 font-brand">{promoError}</p>
                  )}

                  {/* Quick Voucher Tags */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-[#78716C] font-brand">Gunakan:</span>
                    {Object.keys(PROMO_CODES).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleApplyPromo(code)}
                        className="text-[10px] font-brand font-bold bg-white text-[#C85A32] px-2.5 py-1 rounded-lg shadow-xs hover:bg-[#C85A32] hover:text-white transition-colors border-none"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Options */}
            <div>
              <label className="block font-brand font-bold text-xs text-[#1C1917] mb-2">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-3 px-2 rounded-2xl font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast border-none ${
                    paymentMethod === 'qris'
                      ? 'bg-[#FDF5F0] text-[#C85A32] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#1C1917] hover:bg-[#F5F0EB]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#C85A32]" />
                  <span>QRIS / Instant</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-2 rounded-2xl font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast border-none ${
                    paymentMethod === 'card'
                      ? 'bg-[#FDF5F0] text-[#C85A32] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#1C1917] hover:bg-[#F5F0EB]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C85A32]" />
                  <span>Debit / Kredit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('va')}
                  className={`py-3 px-2 rounded-2xl font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast border-none ${
                    paymentMethod === 'va'
                      ? 'bg-[#FDF5F0] text-[#C85A32] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#1C1917] hover:bg-[#F5F0EB]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C85A32]" />
                  <span>BCA VA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('kasir')}
                  className={`py-3 px-2 rounded-2xl font-brand font-bold text-xs flex items-center justify-center gap-2 transition-all btn-fast border-none ${
                    paymentMethod === 'kasir'
                      ? 'bg-[#FDF5F0] text-[#C85A32] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#1C1917] hover:bg-[#F5F0EB]'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-[#C85A32]" />
                  <span>Bayar Kasir</span>
                </button>
              </div>
            </div>

            {/* Total Calculations Card */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border-none space-y-2 font-brand text-xs">
              <div className="flex justify-between text-[#78716C]">
                <span>Total Tagihan Meja #{tableNumber}</span>
                <span className="font-mono font-bold text-[#1C1917]">Rp {formatRupiah(fullTotalPrice)}</span>
              </div>

              {isSplitBill && (
                <>
                  <div className="flex justify-between text-[#C85A32] font-bold">
                    <span>Split Bill ({splitMode === 'equal' ? `Bagi ${splitPeopleCount} Orang` : splitMode === 'item' ? 'Per Item' : 'Nominal Custom'})</span>
                    <span className="font-mono">Rp {formatRupiah(currentPayAmount)}</span>
                  </div>
                  {remainingBalance > 0 && (
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Sisa Tagihan Meja</span>
                      <span className="font-mono">Rp {formatRupiah(remainingBalance)}</span>
                    </div>
                  )}
                </>
              )}

              <hr className="border-slate-200/60 my-1 border-t" />
              
              <div className="flex justify-between font-extrabold text-sm text-[#1C1917] pt-1">
                <span>{isSplitBill ? 'Dibayar Sekarang' : 'Total Pembayaran'}</span>
                <span className="font-brand text-base text-[#C85A32]">Rp {formatRupiah(currentPayAmount)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-fast w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#C85A32]/25 tracking-wide uppercase text-xs border-none"
            >
              <CheckCircle2 className="w-4 h-4" /> {isSplitBill ? `Bayar Bagian Anda (Rp ${formatRupiah(currentPayAmount)})` : 'Lanjut Ke Pembayaran'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
