import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingBag, Banknote, QrCode, CreditCard, Receipt, Tag, CheckCircle2, User, Printer, Lock, AlertCircle, ShieldAlert, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

export default function CashierPosTerminalView({
  menus,
  categories,
  currentRole = 'cashier', // 'cashier' | 'manager' | 'owner'
  activeTableNumber = '08',
  onCompleteOrder
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway'
  const [customerName, setCustomerName] = useState('Tamu Kasir');

  // Pos Cart State
  const [posCart, setPosCart] = useState([]);
  const [discountPct, setDiscountPct] = useState(0); // Cashier discount
  const [appliedPromo, setAppliedPromo] = useState('');

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceivedInput, setCashReceivedInput] = useState('');
  const [completedTransaction, setCompletedTransaction] = useState(null);

  // Shift Modal State
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftCashDrawer, setShiftCashDrawer] = useState('500000'); // Initial cash drawer Rp 500.000

  const filteredMenus = menus.filter(menu => {
    const isAvailable = menu.is_available !== false;
    const matchesCat = selectedCategory === 'all' || menu.category_slug === selectedCategory;
    const matchesSearch = !searchQuery ||
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.description.toLowerCase().includes(searchQuery.toLowerCase());
    return isAvailable && matchesCat && matchesSearch;
  });

  const handleAddItemToCart = (menu) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.menu.id === menu.id);
      if (existing) {
        return prev.map(item =>
          item.menu.id === menu.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { menu, qty: 1, price: menu.price }];
    });
  };

  const handleUpdateQty = (menuId, delta) => {
    setPosCart(prev => {
      return prev.map(item => {
        if (item.menu.id === menuId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveItem = (menuId) => {
    setPosCart(prev => prev.filter(item => item.menu.id !== menuId));
  };

  // Calculations
  const rawSubtotal = posCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // Discount rule: Cashier max limit 10%, Manager can do any
  const maxCashierDiscount = 10;
  const effectiveDiscountPct = currentRole === 'cashier' ? Math.min(discountPct, maxCashierDiscount) : discountPct;
  const discountAmount = Math.round((rawSubtotal * effectiveDiscountPct) / 100);
  
  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);
  const taxAmount = Math.round(subtotalAfterDiscount * 0.10);
  const grandTotal = subtotalAfterDiscount + taxAmount;

  // Cash Change Calculation
  const parsedCashReceived = parseInt(cashReceivedInput.replace(/[^0-9]/g, ''), 10) || 0;
  const cashChange = Math.max(0, parsedCashReceived - grandTotal);

  const handleProcessPaymentSubmit = (e) => {
    e.preventDefault();
    if (posCart.length === 0) return;
    if (paymentMethod === 'cash' && parsedCashReceived < grandTotal) {
      alert(`Uang pembayaran tunai kurang! Minimal Rp ${formatRupiah(grandTotal)}`);
      return;
    }

    const transactionData = {
      id: `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
      orderType,
      tableNumber: activeTableNumber,
      customerName: customerName || 'Pelanggan',
      items: [...posCart],
      rawSubtotal,
      discountPct: effectiveDiscountPct,
      discountAmount,
      taxAmount,
      grandTotal,
      paymentMethod,
      cashReceived: paymentMethod === 'cash' ? parsedCashReceived : grandTotal,
      cashChange: paymentMethod === 'cash' ? cashChange : 0,
      cashierRole: currentRole,
      createdAt: new Date()
    };

    setCompletedTransaction(transactionData);
    setShowPaymentModal(false);
    setPosCart([]);
    setCashReceivedInput('');

    if (onCompleteOrder) {
      onCompleteOrder(transactionData);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-brand select-none flex flex-col lg:flex-row">
      {/* LEFT SIDE: POS MENU SELECTION GRID */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {/* Top Control Bar */}
        <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex items-center shadow-xs rounded-xl bg-[#FAF7F2] w-full md:w-80 overflow-hidden">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu pesanan..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium outline-none bg-transparent"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#1C1917] text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#78716C] hover:bg-slate-200'
              }`}
            >
              Semua Menu
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'bg-[#FAF7F2] text-[#78716C] hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredMenus.map(menu => (
            <motion.div
              key={menu.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAddItemToCart(menu)}
              className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-200/60 flex flex-col justify-between h-44 relative overflow-hidden group"
            >
              {menu.is_bestseller && (
                <span className="absolute top-2 left-2 bg-[#C85A32] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs z-10">
                  Top
                </span>
              )}

              <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-100 mb-2">
                <img
                  src={menu.image}
                  alt={menu.name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <h4 className="font-display font-extrabold text-xs text-[#1C1917] truncate leading-tight">
                  {menu.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono font-extrabold text-xs text-[#C85A32]">
                    Rp {formatRupiah(menu.price)}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#FAF7F2] text-[#1C1917] group-hover:bg-[#C85A32] group-hover:text-white flex items-center justify-center transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: FIXED CASHIER CART & CHECKOUT PANEL */}
      <div className="w-full lg:w-96 bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl flex-shrink-0">
        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          {/* Header Cart Info */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display font-extrabold text-base text-[#1C1917] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#C85A32]" /> ORDER BILL KASIR
              </h3>
              <p className="text-xs text-[#78716C]">
                Terminal Kasir • Shift Active
              </p>
            </div>

            <button
              onClick={() => setShowShiftModal(true)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 font-bold px-2.5 py-1 rounded-lg text-slate-700 flex items-center gap-1"
            >
              <Receipt className="w-3 h-3" /> Shift Kasir
            </button>
          </div>

          {/* Order Meta Inputs (Dine-in / Takeaway & Table) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setOrderType('dine-in')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  orderType === 'dine-in' ? 'bg-[#C85A32] text-white shadow-xs' : 'text-[#78716C]'
                }`}
              >
                Dine-in
              </button>
              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  orderType === 'takeaway' ? 'bg-[#C85A32] text-white shadow-xs' : 'text-[#78716C]'
                }`}
              >
                Takeaway
              </button>
            </div>

            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama Tamu..."
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-[#FAF7F2] text-xs font-bold outline-none text-[#1C1917]"
            />
          </div>

          {/* Cart Items Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
            {posCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <ShoppingBag className="w-10 h-10 stroke-1" />
                <p className="text-xs font-bold">Keranjang kasir masih kosong. Klik menu di sebelah kiri untuk menambahkan pesanan.</p>
              </div>
            ) : (
              posCart.map(item => (
                <div
                  key={item.menu.id}
                  className="p-3 rounded-xl bg-[#FAF7F2] flex items-center justify-between gap-2 border border-slate-200/50"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-extrabold text-xs text-[#1C1917] truncate">
                      {item.menu.name}
                    </h4>
                    <span className="font-mono text-xs text-[#C85A32] font-bold">
                      Rp {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => handleUpdateQty(item.menu.id, -1)}
                      className="w-5 h-5 rounded-md hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-extrabold text-xs w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.menu.id, 1)}
                      className="w-5 h-5 rounded-md hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.menu.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pricing Calculations & Discount Limits */}
          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl space-y-1.5 text-xs font-brand border border-slate-200/60">
            <div className="flex justify-between text-[#78716C]">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-[#1C1917]">Rp {formatRupiah(rawSubtotal)}</span>
            </div>

            {/* Discount Control with Role Limits */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-[#78716C]">
                <Tag className="w-3 h-3 text-[#C85A32]" />
                <span>Diskon (%)</span>
                {currentRole === 'cashier' && (
                  <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                    Max 10% Kasir
                  </span>
                )}
              </div>
              <input
                type="number"
                min={0}
                max={currentRole === 'cashier' ? 10 : 100}
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value))}
                className="w-14 p-1 rounded-lg border border-slate-200 bg-white font-mono font-bold text-center text-xs outline-none"
              />
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 text-xs font-bold">
                <span>Potongan Diskon ({effectiveDiscountPct}%)</span>
                <span className="font-mono">-Rp {formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#78716C]">
              <span>PB1 / Pajak (10%)</span>
              <span className="font-mono font-bold text-[#1C1917]">Rp {formatRupiah(taxAmount)}</span>
            </div>

            <hr className="border-slate-200 my-1" />

            <div className="flex justify-between items-center font-extrabold text-sm text-[#1C1917] pt-0.5">
              <span>Total Tagihan:</span>
              <span className="font-mono text-base text-[#C85A32]">Rp {formatRupiah(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Payment Trigger Button */}
        <button
          disabled={posCart.length === 0}
          onClick={() => setShowPaymentModal(true)}
          className="w-full mt-4 bg-gradient-to-r from-[#C85A32] to-[#E8703E] disabled:from-slate-300 disabled:to-slate-300 text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg text-xs tracking-wider uppercase border-none"
        >
          <Banknote className="w-4 h-4" /> Proses Pembayaran (Rp {formatRupiah(grandTotal)})
        </button>
      </div>

      {/* PAYMENT & CASH CALCULATOR MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-extrabold text-base text-[#1C1917] flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-[#C85A32]" /> Pembayaran Kasir
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-[#1C1917]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Payment Method Selector (Cash, QRIS, Card) */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'cash'
                      ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#1C1917] border-slate-200'
                  }`}
                >
                  <Banknote className="w-4 h-4" /> Tunai / Cash
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'qris'
                      ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#1C1917] border-slate-200'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> QRIS Instant
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#1C1917] border-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> EDC Debit/Kredit
                </button>
              </div>

              {/* Cash Change Calculator */}
              {paymentMethod === 'cash' && (
                <div className="bg-[#FAF7F2] p-4 rounded-2xl space-y-3 border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#78716C]">Total Yang Harus Dibayar:</span>
                    <span className="font-mono font-extrabold text-sm text-[#C85A32]">Rp {formatRupiah(grandTotal)}</span>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#78716C] mb-1 font-bold uppercase">
                      Uang Tunai Diterima Dari Tamu:
                    </label>
                    <input
                      type="number"
                      required
                      autoFocus
                      value={cashReceivedInput}
                      onChange={(e) => setCashReceivedInput(e.target.value)}
                      placeholder={`Cth: ${grandTotal}`}
                      className="w-full p-3 rounded-xl border border-slate-200 font-mono font-extrabold text-lg text-[#1C1917] outline-none text-center bg-white"
                    />
                  </div>

                  {/* Quick Cash Presets */}
                  <div className="flex gap-1.5 justify-center">
                    {[grandTotal, 50000, 100000, 200000].map(amount => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setCashReceivedInput(amount.toString())}
                        className="text-[10px] font-mono font-bold bg-white text-[#1C1917] border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-[#C85A32] hover:text-white transition-colors"
                      >
                        Rp {formatRupiah(amount)}
                      </button>
                    ))}
                  </div>

                  <hr className="border-slate-200 my-1" />

                  <div className="flex justify-between items-center font-extrabold text-sm">
                    <span className="text-[#1C1917]">Kembalian Kasir:</span>
                    <span className="font-mono text-base text-emerald-700">Rp {formatRupiah(cashChange)}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleProcessPaymentSubmit} className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md text-xs uppercase tracking-wider"
                >
                  <CheckCircle2 className="w-4 h-4" /> Pelunasan Transaksi & Print Struk
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPLETED RECEIPT MODAL */}
      <AnimatePresence>
        {completedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-display font-extrabold text-base text-[#1C1917]">
                Transaksi Berhasil Dilunasi!
              </h3>

              {/* Printable Receipt Preview Card */}
              <div id="printable-receipt" className="bg-[#FAF7F2] p-4 rounded-2xl text-left font-mono text-[11px] space-y-1.5 border border-slate-200 text-slate-800">
                <div className="text-center font-bold text-xs pb-1 border-b border-dashed border-slate-300">
                  DUMP CAFE & EATERY<br />
                  <span className="text-[10px] font-normal">Artisan & Eatery Cilegon</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>ID: {completedTransaction.id}</span>
                  <span>{new Date(completedTransaction.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Meja: #{completedTransaction.tableNumber}</span>
                  <span>Kasir: {completedTransaction.cashierRole.toUpperCase()}</span>
                </div>
                <hr className="border-dashed border-slate-300 my-1" />

                {completedTransaction.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.qty}x {item.menu.name}</span>
                    <span>Rp {formatRupiah(item.price * item.qty)}</span>
                  </div>
                ))}

                <hr className="border-dashed border-slate-300 my-1" />
                <div className="flex justify-between font-bold">
                  <span>Total Tagihan:</span>
                  <span>Rp {formatRupiah(completedTransaction.grandTotal)}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Metode Bayar:</span>
                  <span className="uppercase">{completedTransaction.paymentMethod}</span>
                </div>
                {completedTransaction.paymentMethod === 'cash' && (
                  <>
                    <div className="flex justify-between text-[10px]">
                      <span>Tunai Diterima:</span>
                      <span>Rp {formatRupiah(completedTransaction.cashReceived)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700">
                      <span>Kembalian:</span>
                      <span>Rp {formatRupiah(completedTransaction.cashChange)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Thermal
                </button>
                <button
                  onClick={() => setCompletedTransaction(null)}
                  className="flex-1 py-3 rounded-2xl bg-[#C85A32] font-bold text-xs text-white shadow-sm"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* SHIFT CASH DRAWER MODAL */}
      <AnimatePresence>
        {showShiftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 text-center shadow-2xl">
              <h3 className="font-display font-extrabold text-base text-[#1C1917]">
                Manajemen Shift Kasir
              </h3>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Role Aktif:</span>
                  <span className="font-bold text-[#1C1917] uppercase">{currentRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Modal Awal Kasir:</span>
                  <span className="font-mono font-bold text-[#C85A32]">Rp {formatRupiah(Number(shiftCashDrawer))}</span>
                </div>
              </div>

              <button
                onClick={() => setShowShiftModal(false)}
                className="w-full bg-[#1C1917] text-white font-bold py-3.5 rounded-2xl text-xs"
              >
                Tutup Ringkasan Shift
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
