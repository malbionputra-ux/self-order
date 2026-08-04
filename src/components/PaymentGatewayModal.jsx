import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, ShieldCheck, Clock, ArrowRight, Banknote, CreditCard, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

export default function PaymentGatewayModal({ isOpen, onClose, orderData, onPaymentSuccess }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);

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
    setIsProcessing(true);
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      >
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
                <span className="text-[10px] text-white/60 font-mono">Powered by Midtrans Snap QRIS</span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Countdown & Merchant Info Bar */}
          <div className="bg-[#FAF7F2] p-3 px-4 border-b border-[#EFE9E2] flex items-center justify-between text-xs font-brand">
            <div>
              <span className="text-[#7E746F] block text-[10px] uppercase font-bold">TOTAL PEMBAYARAN</span>
              <span className="font-brand font-extrabold text-base text-[#C85A32]">
                Rp {formatRupiah(orderData.totalPrice)}
              </span>
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
          <div className="p-5 overflow-y-auto space-y-4">
            {orderData.payment_method === 'qris' && (
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-1 bg-[#C85A32]/10 text-[#C85A32] text-[11px] font-brand font-bold px-3 py-1 rounded-full">
                  <QrCode className="w-3.5 h-3.5" /> SCAN DENGAN APLIKASI BANYAK BENEFIT
                </span>

                {/* QR Code Container with Scan Line Animation */}
                <div className="relative w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-2 border-[#EFE9E2] shadow-md flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=KIRICOFFEE_ORDER_${orderData.table_number}_${orderData.totalPrice}`}
                    alt="QRIS QR Code"
                    className="w-full h-full object-contain"
                  />
                  {/* Moving Laser Scanner Line */}
                  <motion.div
                    animate={{ y: [-90, 90, -90] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#C85A32] to-transparent shadow-sm shadow-[#C85A32]"
                  />
                </div>

                <div className="flex items-center justify-center gap-3 text-slate-400 opacity-80 pt-1">
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">Gopay</span>
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">ShopeePay</span>
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">OVO</span>
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">DANA</span>
                  <span className="text-[10px] font-brand font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-md border">BCA QR</span>
                </div>
              </div>
            )}

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
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopyVA}
                    className="bg-[#C85A32] text-white text-xs font-brand font-bold px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin!' : 'Salin'}
                  </motion.button>
                </div>
              </div>
            )}

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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.94 }}
              disabled={isProcessing}
              onClick={handleSimulateSuccess}
              className="w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#C85A32]/25 tracking-wide text-xs btn-premium"
            >
              {isProcessing ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Simulasikan Pembayaran Berhasil</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </motion.button>

            <button
              onClick={onClose}
              className="w-full text-center text-xs font-brand text-[#7E746F] hover:text-[#2C221E] py-1"
            >
              Batal / Ubah Metode
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
