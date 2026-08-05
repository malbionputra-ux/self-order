import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Flame, CupSoda, PlusCircle, Scissors } from 'lucide-react';
import { formatRupiah } from '../data/menuData';

function ConfettiParticle({ delay, color, left }) {
  return (
    <div
      className="absolute top-0 w-2 h-2 rounded-full pointer-events-none animate-fade-in-up"
      style={{ 
        left: `${left}%`, 
        backgroundColor: color,
        animationDuration: `${2.5 + Math.random() * 1.5}s`,
        animationDelay: `${delay}s`
      }}
    />
  );
}

const confettiColors = ['#C85A32', '#FFB396', '#FBBF24', '#F87171', '#60A5FA', '#34D399', '#A78BFA'];

export default function OrderSuccessScreen({ order, onNewOrder }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!order) return null;

  const formattedDate = new Date(order.created_at || Date.now()).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="p-4 text-center min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#FDF5F0] to-[#FAF7F2] flex flex-col justify-between relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 no-print">
          {Array.from({ length: 25 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 0.1}
              color={confettiColors[i % confettiColors.length]}
              left={Math.random() * 100}
            />
          ))}
        </div>
      )}

      {/* Screen Interactive Content */}
      <div className="relative z-20 no-print">
        {/* Success Animated Icon */}
        <div className="my-6 flex justify-center relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C85A32] to-[#E8703E] flex items-center justify-center shadow-xl shadow-[#C85A32]/30 relative z-10 animate-pop-in">
            <CheckCircle2 className="w-11 h-11 text-white" />
          </div>
        </div>

        <div className="animate-fade-in-up">
          <h1 className="font-serif font-bold text-xl text-[#2C221E] mb-1 flex items-center justify-center gap-2">
            Pembayaran Berhasil! 🎉
          </h1>
          <p className="text-xs text-[#7E746F] mb-5">
            Pesanan Anda telah diterima barista & kitchen Kiri Coffee.
          </p>
        </div>

        {/* Barista Status Monitoring */}
        <div className="bg-white p-4 rounded-3xl border border-[#EFE9E2] text-left mb-4 shadow-xs animate-fade-in-up">
          <span className="font-brand font-bold text-[11px] text-[#7E746F] block mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C85A32]" /> STATUS MONITORING BARISTA
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-brand font-bold">
            <span className="bg-[#C85A32] text-white py-2 rounded-xl flex items-center justify-center gap-1 shadow-xs">
              <Clock className="w-3 h-3" /> Diterima
            </span>
            <span className="bg-[#C85A32] text-white py-2 rounded-xl flex items-center justify-center gap-1 shadow-xs">
              <Flame className="w-3 h-3" /> Diseduh
            </span>
            <span className="bg-[#EFE9E2] text-[#7E746F] py-2 rounded-xl flex items-center justify-center gap-1">
              <CupSoda className="w-3 h-3" /> Disajikan
            </span>
          </div>
        </div>

        {/* Receipt Display Card */}
        <div className="bg-white rounded-3xl border border-[#EFE9E2] text-left shadow-md overflow-hidden mb-6 animate-fade-in-up">
          <div className="bg-gradient-to-r from-[#2C221E] to-[#3D2D27] p-4 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] text-white/55 block font-brand uppercase">ID PESANAN</span>
              <span className="font-mono font-bold text-sm">#{String(order.id || 101).padStart(5, '0')}</span>
            </div>
            <span className="bg-amber-400 text-[#2C221E] font-brand font-extrabold text-xs px-3 py-1 rounded-full shadow-xs">
              MEJA #{order.table_number}
            </span>
          </div>

          <div className="p-4 space-y-4 font-brand text-xs">
            <div className="grid grid-cols-2 pb-3 border-b border-[#EFE9E2]">
              <div>
                <span className="text-[#7E746F] block text-[10px]">Nama Pemesan:</span>
                <strong className="text-[#2C221E]">{order.customer_name}</strong>
              </div>
              <div className="text-right">
                <span className="text-[#7E746F] block text-[10px]">Metode Bayar:</span>
                <strong className="uppercase text-[#C85A32]">{order.payment_method}</strong>
              </div>
            </div>

            {/* Split Bill Active Badge */}
            {order.isSplitBill && order.splitDetails && (
              <div className="bg-[#FDF5F0] border border-[#C85A32]/30 p-2.5 rounded-2xl flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#C85A32] text-white flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
                <div className="flex-1 text-[11px]">
                  <span className="font-brand font-bold text-[#C85A32] block">
                    Split Bill Active ({order.splitDetails.mode === 'equal' ? `Bagi ${order.splitDetails.peopleCount} Orang` : 'Partial Payment'})
                  </span>
                  <span className="text-[#7E746F]">
                    Sisa Tagihan Meja #{order.table_number}: <strong className="text-[#2C221E]">Rp {formatRupiah(order.splitDetails.remainingBalance)}</strong>
                  </span>
                </div>
              </div>
            )}

            <div>
              <span className="font-bold text-[#7E746F] block mb-2 text-[11px] uppercase tracking-wide">
                RINCIAN PESANAN
              </span>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center pb-2 border-b border-slate-100"
                  >
                    <div>
                      <div className="font-bold text-[#2C221E]">{item.menu.name} x {item.quantity}</div>
                      <div className="text-[10px] text-[#7E746F] flex gap-1 mt-0.5">
                        {item.customizations?.ice && <span>{item.customizations.ice}</span>}
                        {item.customizations?.milk && <span>• {item.customizations.milk}</span>}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#2C221E]">
                      Rp {formatRupiah(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EFE9E2] space-y-1.5">
              <div className="flex justify-between text-[#7E746F]">
                <span>Total Tagihan Meja</span>
                <span className="font-mono">Rp {formatRupiah(order.fullTotalPrice || order.totalPrice)}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Diskon Promo ({order.appliedPromo})</span>
                  <span className="font-mono">-Rp {formatRupiah(order.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#7E746F]">
                <span>Pajak PB1 Resto (10%)</span>
                <span className="font-mono">Rp {formatRupiah(order.taxAmount)}</span>
              </div>
              <hr className="border-[#EFE9E2] my-1" />
              <div className="flex justify-between font-extrabold text-sm text-[#2C221E]">
                <span>{order.isSplitBill ? 'Bagian Yang Dibayar' : 'Total Akhir'}</span>
                <span className="text-[#C85A32]">Rp {formatRupiah(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onNewOrder}
        className="btn-fast w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] hover:from-[#A44321] hover:to-[#C85A32] text-white font-brand font-extrabold py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#C85A32]/25 tracking-wide uppercase text-xs no-print"
      >
        <PlusCircle className="w-4 h-4" /> Pesan Menu Lainnya
      </button>
    </div>
  );
}
