import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, ShieldCheck, Clock, ArrowRight, Banknote, CreditCard, Sparkles, Camera, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

export default function PaymentGatewayModal({ isOpen, onClose, orderData, onPaymentSuccess, onOpenScanner }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isProcessing, setIsProcessing] = useState(false);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(900);
      setIsProcessing(false);
      setCopied(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  if (!isOpen || !orderData) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const vaNumber = `8801${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const handleCopyVA = () => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSuccess = () => {
    if (orderData.payment_method === 'card' && !cardNumber.trim()) {
      alert('Masukkan nomor kartu debit/kredit terlebih dahulu.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentSuccess();
    }, 1200);
  };

  const formatCardInput = (val) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl border border-[#EFE9E2] flex flex-col relative"
        >
          {/* Top Payment Gateway Header */}
          <div className="bg-gradient-to-r from-[#2C221E] via-[#3D2D27] to-[#2C221E] p-4 text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C85A32] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-brand font-extrabold text-xs tracking-wider block">KIRI PAYMENT GATEWAY</span>
                <span className="text-[10px] text-white/60 font-mono">256-bit SSL Encrypted Payment</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-fast w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Countdown & Merchant Info Bar */}
          <div className="bg-[#FAF7F2] p-3 px-4 border-b border-[#EFE9E2] flex items-center justify-between text-xs font-brand">
            <div>
              <span className="text-[#7E746F] block text-[10px] uppercase font-bold">TOTAL PEMBAYARAN</span>
              <span className="font-brand font-extrabold text-base text-[#C85A32]">
                Rp {formatRupiah(orderData.totalPrice)}
              </span>
              {orderData.discountAmount > 0 && (
                <span className="text-[10px] text-emerald-600 block font-brand font-bold">
                  Hemat Rp {formatRupiah(orderData.discountAmount)} ({orderData.appliedPromo})
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[#7E746F] block text-[10px] uppercase font-bold flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3 text-[#C85A32]" /> BATAS WAKTU
              </span>
              <span className="font-mono font-extrabold text-sm text-[#2C221E] bg-white px-2 py-0.5 rounded-md border border-[#EFE9E2]">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-4 max-h-[60vh]">
            {/* QRIS Mode */}
            {orderData.payment_method === 'qris' && (
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-1 bg-[#C85A32]/10 text-[#C85A32] text-[11px] font-brand font-bold px-3 py-1 rounded-full">
                  <QrCode className="w-3.5 h-3.5" /> SCAN DENGAN APLIKASI BANYAK BENEFIT
                </span>

                {/* QR Code Container with Scan Line Animation */}
                <div className="relative w-52 h-52 mx-auto bg-white p-3 rounded-2xl border-2 border-[#EFE9E2] shadow-md flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=KIRICOFFEE_ORDER_${orderData.table_number}_${orderData.totalPrice}`}
                    alt="QRIS QR Code"
                    className="w-full h-full object-contain"
                  />
                  {/* Moving Laser Scanner Line */}
                  <motion.div
                    animate={{ y: [-80, 80, -80] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#C85A32] to-transparent shadow-sm shadow-[#C85A32]"
                  />
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={onOpenScanner}
                    className="btn-fast bg-[#C85A32]/10 hover:bg-[#C85A32] text-[#C85A32] hover:text-white text-xs font-brand font-bold px-3.5 py-1.5 rounded-xl border border-[#C85A32]/30 flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" /> Buka Kamera QRIS
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-400 opacity-80 pt-1">
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">GoPay</span>
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">ShopeePay</span>
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">OVO</span>
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">DANA</span>
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">BCA QR</span>
                </div>
              </div>
            )}

            {/* Credit / Debit Card Mode */}
            {orderData.payment_method === 'card' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-[#C85A32]/10 text-[#C85A32] text-[11px] font-brand font-bold px-3 py-1 rounded-full">
                    <CreditCard className="w-3.5 h-3.5" /> KARTU DEBIT / KREDIT VISA / MASTERCARD
                  </span>
                  <Lock className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="bg-gradient-to-br from-[#2C221E] via-[#382B25] to-[#2C221E] p-4 rounded-2xl text-white shadow-lg space-y-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-amber-300">KIRI CARD PAY</span>
                    <span className="text-xs font-bold font-mono bg-white/10 px-2 py-0.5 rounded">VISA / MC</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 block font-brand">NOMOR KARTU</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                      placeholder="4111 2222 3333 4444"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm font-mono text-white placeholder-white/40 outline-none focus:border-[#C85A32]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-white/60 block font-brand">BERLAKU S/D</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-mono text-white placeholder-white/40 outline-none focus:border-[#C85A32]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-white/60 block font-brand">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-mono text-white placeholder-white/40 outline-none focus:border-[#C85A32]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-white/60 block font-brand">NAMA PEMEGANG KARTU</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="NAMA LENGKAP KARTU"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-brand text-white placeholder-white/40 outline-none focus:border-[#C85A32]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Virtual Account Mode */}
            {orderData.payment_method === 'va' && (
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1 bg-[#C85A32]/10 text-[#C85A32] text-[11px] font-brand font-bold px-3 py-1 rounded-full">
                  <CreditCard className="w-3.5 h-3.5" /> NOMOR VIRTUAL ACCOUNT BCA
                </span>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border-2 border-[#EFE9E2] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#7E746F] block font-brand">BANK BCA VIRTUAL ACCOUNT</span>
                    <span className="font-mono font-extrabold text-lg text-[#2C221E] tracking-wider">
                      {vaNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyVA}
                    className="btn-fast bg-[#C85A32] text-white text-xs font-brand font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>
              </div>
            )}

            {/* Cash Counter Mode */}
            {orderData.payment_method === 'kasir' && (
              <div className="text-center space-y-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#EFE9E2]">
                <Banknote className="w-10 h-10 text-[#C85A32] mx-auto" />
                <h4 className="font-brand font-extrabold text-sm text-[#2C221E]">
                  Tunjukkan Kode Ini ke Kasir
                </h4>
                <div className="bg-white p-2.5 rounded-xl border border-[#EFE9E2] font-mono font-extrabold text-xl text-[#C85A32]">
                  PAY-KIRI-MEJA{orderData.table_number}
                </div>
                <p className="text-xs text-[#7E746F]">
                  Silakan lakukan pembayaran tunai atau EDC di meja kasir Kiri Coffee.
                </p>
              </div>
            )}
          </div>

          {/* Action Simulation Footer */}
          <div className="p-4 bg-slate-50 border-t border-[#EFE9E2] space-y-2">
            <button
              disabled={isProcessing}
              onClick={handleSimulateSuccess}
              className="btn-fast w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#C85A32]/25 tracking-wide text-xs"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Simulasikan Pembayaran Berhasil</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full text-center text-xs font-brand text-[#7E746F] hover:text-[#2C221E] py-1"
            >
              Batal / Ubah Metode
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
