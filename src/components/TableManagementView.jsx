import React, { useState } from 'react';
import { LayoutGrid, Users, CheckCircle2, AlertCircle, Lock, ArrowRight, RefreshCw, X, ShoppingBag, Plus, DollarSign, LogOut, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

// Initial Mock Tables Data for F&B Outlet
const INITIAL_TABLES = [
  { id: '01', area: 'Indoor', label: 'Meja 01', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '02', area: 'Indoor', label: 'Meja 02', capacity: 4, status: 'occupied', customerName: 'Andi', totalAmount: 72000, itemsCount: 3, orderId: 'ORD-8821' },
  { id: '03', area: 'Indoor', label: 'Meja 03', capacity: 4, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '04', area: 'Indoor', label: 'Meja 04', capacity: 6, status: 'closed', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '05', area: 'Indoor', label: 'Meja 05', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '08', area: 'Indoor', label: 'Meja 08', capacity: 4, status: 'occupied', customerName: 'Rian', totalAmount: 95000, itemsCount: 4, orderId: 'ORD-8825' },
  { id: '09', area: 'Indoor', label: 'Meja 09', capacity: 4, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  
  { id: 'OUT-01', area: 'Outdoor', label: 'Terrace 01', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: 'OUT-02', area: 'Outdoor', label: 'Terrace 02', capacity: 4, status: 'occupied', customerName: 'Maya', totalAmount: 118000, itemsCount: 5, orderId: 'ORD-8830' },
  { id: 'OUT-03', area: 'Outdoor', label: 'Terrace 03', capacity: 4, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  
  { id: 'VIP-01', area: 'VIP Lounge', label: 'VIP Room 1', capacity: 8, status: 'occupied', customerName: 'Bpk. Hendra', totalAmount: 340000, itemsCount: 12, orderId: 'ORD-8800' },
  { id: 'VIP-02', area: 'VIP Lounge', label: 'VIP Room 2', capacity: 10, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
];

export default function TableManagementView({
  currentActiveTable,
  onSelectTableAndOrder,
  onCloseMap
}) {
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [selectedArea, setSelectedArea] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTable, setSelectedTable] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [targetMoveTableId, setTargetMoveTableId] = useState('');

  // Filter Logic
  const filteredTables = tables.filter(table => {
    const matchesArea = selectedArea === 'Semua' || table.area === selectedArea;
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    return matchesArea && matchesStatus;
  });

  // Counters
  const totalCount = tables.length;
  const openCount = tables.filter(t => t.status === 'open').length;
  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const closedCount = tables.filter(t => t.status === 'closed').length;

  // Actions
  const handleUpdateTableStatus = (tableId, newStatus, customerName = '', totalAmount = 0, itemsCount = 0) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: newStatus,
          customerName: newStatus === 'occupied' ? customerName : '',
          totalAmount: newStatus === 'occupied' ? totalAmount : 0,
          itemsCount: newStatus === 'occupied' ? itemsCount : 0,
          orderId: newStatus === 'occupied' ? (t.orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`) : null
        };
      }
      return t;
    }));
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable(prev => ({
        ...prev,
        status: newStatus,
        customerName: newStatus === 'occupied' ? customerName : '',
        totalAmount: newStatus === 'occupied' ? totalAmount : 0,
        itemsCount: newStatus === 'occupied' ? itemsCount : 0
      }));
    }
  };

  const handleMoveTable = (fromTableId, toTableId) => {
    const fromTable = tables.find(t => t.id === fromTableId);
    if (!fromTable || !toTableId) return;

    setTables(prev => prev.map(t => {
      if (t.id === toTableId) {
        return {
          ...t,
          status: 'occupied',
          customerName: fromTable.customerName,
          totalAmount: fromTable.totalAmount,
          itemsCount: fromTable.itemsCount,
          orderId: fromTable.orderId
        };
      }
      if (t.id === fromTableId) {
        return {
          ...t,
          status: 'open',
          customerName: '',
          totalAmount: 0,
          itemsCount: 0,
          orderId: null
        };
      }
      return t;
    }));

    setShowMoveModal(false);
    setSelectedTable(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-10 text-[#1C1917] font-brand select-none">
      {/* Top Bar Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#C85A32] text-white flex items-center justify-center shadow-md">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-sm text-[#1C1917] tracking-tight">
              PETA & MANAJEMEN MEJA
            </h1>
            <p className="text-[10px] text-[#78716C]">
              Dump Cafe & Eatery POS
            </p>
          </div>
        </div>

        <button
          onClick={onCloseMap}
          className="btn-fast bg-[#FAF7F2] text-[#1C1917] p-2 rounded-full hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        {/* Status Summary Bar */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-2.5 rounded-2xl text-center transition-all ${
              statusFilter === 'all'
                ? 'bg-[#1C1917] text-white shadow-md'
                : 'bg-white text-[#78716C] shadow-xs'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold tracking-wider">Semua</span>
            <span className="font-mono font-extrabold text-base">{totalCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('open')}
            className={`p-2.5 rounded-2xl text-center transition-all ${
              statusFilter === 'open'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-emerald-700 shadow-xs'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold tracking-wider">Open</span>
            <span className="font-mono font-extrabold text-base">{openCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('occupied')}
            className={`p-2.5 rounded-2xl text-center transition-all ${
              statusFilter === 'occupied'
                ? 'bg-[#C85A32] text-white shadow-md'
                : 'bg-white text-[#C85A32] shadow-xs'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold tracking-wider">Terisi</span>
            <span className="font-mono font-extrabold text-base">{occupiedCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('closed')}
            className={`p-2.5 rounded-2xl text-center transition-all ${
              statusFilter === 'closed'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-white text-slate-500 shadow-xs'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold tracking-wider">Tutup</span>
            <span className="font-mono font-extrabold text-base">{closedCount}</span>
          </button>
        </div>

        {/* Area Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {['Semua', 'Indoor', 'Outdoor', 'VIP Lounge'].map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedArea === area
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'bg-white text-[#78716C] hover:bg-slate-100 shadow-xs'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Table Map Grid View */}
        <div className="grid grid-cols-2 gap-3.5">
          {filteredTables.map(table => {
            const isOpen = table.status === 'open';
            const isOccupied = table.status === 'occupied';
            const isClosed = table.status === 'closed';
            const isCurrentActive = currentActiveTable === table.id;

            return (
              <motion.div
                key={table.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedTable(table)}
                className={`
                  p-4 rounded-[24px] cursor-pointer relative flex flex-col justify-between min-h-[140px] transition-all shadow-md
                  ${isOpen ? 'bg-white text-[#1C1917] hover:shadow-lg' : ''}
                  ${isOccupied ? 'bg-gradient-to-br from-[#2C221E] to-[#382B25] text-white shadow-xl' : ''}
                  ${isClosed ? 'bg-slate-200 text-slate-500 opacity-80' : ''}
                  ${isCurrentActive ? 'ring-4 ring-[#C85A32]' : ''}
                `}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-display font-extrabold text-sm block">
                      {table.label}
                    </span>
                    <span className={`text-[10px] font-medium flex items-center gap-1 ${isOccupied ? 'text-white/70' : 'text-[#78716C]'}`}>
                      <Users className="w-3 h-3" /> {table.capacity} Kursi • {table.area}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {isOpen && (
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> OPEN
                    </span>
                  )}
                  {isOccupied && (
                    <span className="bg-[#C85A32] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" /> TERISI
                    </span>
                  )}
                  {isClosed && (
                    <span className="bg-slate-400 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> TUTUP
                    </span>
                  )}
                </div>

                {/* Table Body Content */}
                <div className="mt-3 pt-2 border-t border-current/10">
                  {isOpen && (
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      Tersedia untuk dipesan
                    </p>
                  )}

                  {isOccupied && (
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-amber-200 font-bold truncate max-w-[90px]">{table.customerName || 'Tamu'}</span>
                        <span className="text-white/60 text-[10px]">{table.itemsCount} item</span>
                      </div>
                      <span className="font-mono font-extrabold text-xs text-white block">
                        Rp {formatRupiah(table.totalAmount)}
                      </span>
                    </div>
                  )}

                  {isClosed && (
                    <p className="text-[10px] text-slate-500 font-medium">
                      Meja ditutup / reservasi
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Table Details Action Modal */}
      <AnimatePresence>
        {selectedTable && !showMoveModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 backdrop-blur-md">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="bg-white rounded-t-[32px] p-5 w-full max-w-md space-y-4 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-extrabold text-base text-[#1C1917]">
                      {selectedTable.label}
                    </h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      selectedTable.status === 'open' ? 'bg-emerald-100 text-emerald-800' :
                      selectedTable.status === 'occupied' ? 'bg-[#C85A32] text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {selectedTable.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C]">
                    Area: {selectedTable.area} • Kapasitas {selectedTable.capacity} Kursi
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1C1917]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Table Info Body */}
              {selectedTable.status === 'occupied' && (
                <div className="bg-[#FAF7F2] p-3.5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#78716C]">Pemesan:</span>
                    <span className="font-bold text-xs text-[#1C1917]">{selectedTable.customerName || 'Tamu'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#78716C]">Order ID:</span>
                    <span className="font-mono text-xs text-[#C85A32] font-bold">{selectedTable.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#78716C]">Jumlah Pesanan:</span>
                    <span className="font-bold text-xs text-[#1C1917]">{selectedTable.itemsCount} Items</span>
                  </div>
                  <hr className="border-slate-200 my-1" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#1C1917]">Running Total:</span>
                    <span className="font-mono font-extrabold text-sm text-[#C85A32]">Rp {formatRupiah(selectedTable.totalAmount)}</span>
                  </div>
                </div>
              )}

              {/* Actions List */}
              <div className="space-y-2 pt-1">
                {selectedTable.status === 'open' && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateTableStatus(selectedTable.id, 'occupied', 'Pelanggan Meja ' + selectedTable.id, 0, 0);
                        onSelectTableAndOrder(selectedTable.id);
                        setSelectedTable(null);
                      }}
                      className="w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md text-xs"
                    >
                      <ShoppingBag className="w-4 h-4" /> Buka Meja & Pilih Menu
                    </button>
                    <button
                      onClick={() => handleUpdateTableStatus(selectedTable.id, 'closed')}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs"
                    >
                      <Lock className="w-4 h-4" /> Tandai Tutup / Reserve
                    </button>
                  </>
                )}

                {selectedTable.status === 'occupied' && (
                  <>
                    <button
                      onClick={() => {
                        onSelectTableAndOrder(selectedTable.id);
                        setSelectedTable(null);
                      }}
                      className="w-full bg-[#C85A32] text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Tambah Pesanan Ke Meja Ini
                    </button>

                    <button
                      onClick={() => {
                        setShowMoveModal(true);
                      }}
                      className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs"
                    >
                      <ArrowRightLeft className="w-4 h-4" /> Pindah Meja (Transfer Order)
                    </button>

                    <button
                      onClick={() => handleUpdateTableStatus(selectedTable.id, 'open')}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs"
                    >
                      <LogOut className="w-4 h-4" /> Selesaikan & Kosongkan Meja
                    </button>
                  </>
                )}

                {selectedTable.status === 'closed' && (
                  <button
                    onClick={() => handleUpdateTableStatus(selectedTable.id, 'open')}
                    className="w-full bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Buka Kembali Meja (Tersedia)
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer / Move Table Modal */}
      <AnimatePresence>
        {showMoveModal && selectedTable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-4 text-center">
              <h3 className="font-display font-extrabold text-base text-[#1C1917]">
                Pindah Pesanan Dari {selectedTable.label}
              </h3>
              <p className="text-xs text-[#78716C]">
                Pilih meja tujuan yang masih kosong (OPEN) untuk mentransfer orderan ini:
              </p>

              <select
                value={targetMoveTableId}
                onChange={(e) => setTargetMoveTableId(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 font-bold text-xs bg-[#FAF7F2] text-[#1C1917] outline-none"
              >
                <option value="">-- Pilih Meja Tujuan --</option>
                {tables.filter(t => t.status === 'open').map(t => (
                  <option key={t.id} value={t.id}>
                    {t.label} ({t.area} • {t.capacity} Kursi)
                  </option>
                ))}
              </select>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowMoveModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 font-bold text-xs text-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleMoveTable(selectedTable.id, targetMoveTableId)}
                  disabled={!targetMoveTableId}
                  className="flex-1 py-3 rounded-2xl bg-[#C85A32] disabled:bg-slate-300 font-bold text-xs text-white shadow-sm"
                >
                  Konfirmasi Pindah
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
