import React, { useState } from 'react';
import { LayoutGrid, Users, CheckCircle2, AlertCircle, Lock, ArrowRight, RefreshCw, X, ShoppingBag, Plus, DollarSign, LogOut, ArrowRightLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupiah } from '../data/menuData';

// Initial Mock Tables Data for F&B Outlet
const INITIAL_TABLES = [
  { id: '01', area: 'Indoor Main', label: 'Meja 01', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '02', area: 'Indoor Main', label: 'Meja 02', capacity: 4, status: 'occupied', customerName: 'Andi', totalAmount: 72000, itemsCount: 3, orderId: 'ORD-8821' },
  { id: '03', area: 'Indoor Main', label: 'Meja 03', capacity: 4, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '04', area: 'Indoor Main', label: 'Meja 04', capacity: 6, status: 'closed', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '05', area: 'Indoor Main', label: 'Meja 05', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '06', area: 'Indoor Main', label: 'Meja 06', capacity: 4, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '07', area: 'Indoor Main', label: 'Meja 07', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '08', area: 'Indoor Main', label: 'Meja 08', capacity: 4, status: 'occupied', customerName: 'Rian', totalAmount: 95000, itemsCount: 4, orderId: 'ORD-8825' },
  { id: '09', area: 'Indoor Main', label: 'Meja 09', capacity: 4, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: '10', area: 'Indoor Main', label: 'Meja 10', capacity: 6, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  
  { id: 'OUT-01', area: 'Outdoor Terrace', label: 'Terrace 01', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: 'OUT-02', area: 'Outdoor Terrace', label: 'Terrace 02', capacity: 4, status: 'occupied', customerName: 'Maya', totalAmount: 118000, itemsCount: 5, orderId: 'ORD-8830' },
  { id: 'OUT-03', area: 'Outdoor Terrace', label: 'Terrace 03', capacity: 4, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  { id: 'OUT-04', area: 'Outdoor Terrace', label: 'Terrace 04', capacity: 6, status: 'closed', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null },
  
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
  const [selectedTable, setSelectedTable] = useState(tables[1]); // Default select Meja 02 on Tablet/Laptop
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
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-brand select-none flex flex-col">
      {/* Tablet / Laptop Header Bar */}
      <div className="bg-white px-6 py-3.5 border-b border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C85A32] text-white flex items-center justify-center shadow-md">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-base text-[#1C1917] tracking-tight">
              PETA & MANAJEMEN MEJA (POS TERMINAL)
            </h1>
            <p className="text-xs text-[#78716C]">
              Denah Layout Realtime Outlet Dump Cafe
            </p>
          </div>
        </div>

        {/* Status Counters Bar - Tablet Wide */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              statusFilter === 'all'
                ? 'bg-[#1C1917] text-white shadow-md'
                : 'bg-[#FAF7F2] text-[#78716C] hover:bg-slate-200'
            }`}
          >
            <span>Semua</span>
            <span className="font-mono font-extrabold px-2 py-0.5 rounded-md bg-white/20 text-xs">{totalCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('open')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              statusFilter === 'open'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span>Open (Tersedia)</span>
            <span className="font-mono font-extrabold px-2 py-0.5 rounded-md bg-white/20 text-xs">{openCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('occupied')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              statusFilter === 'occupied'
                ? 'bg-[#C85A32] text-white shadow-md'
                : 'bg-orange-50 text-[#C85A32] hover:bg-orange-100'
            }`}
          >
            <span>Terisi (Occupied)</span>
            <span className="font-mono font-extrabold px-2 py-0.5 rounded-md bg-white/20 text-xs">{occupiedCount}</span>
          </button>

          <button
            onClick={() => setStatusFilter('closed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              statusFilter === 'closed'
                ? 'bg-slate-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Ditutup</span>
            <span className="font-mono font-extrabold px-2 py-0.5 rounded-md bg-white/20 text-xs">{closedCount}</span>
          </button>
        </div>
      </div>

      {/* Main Tablet/Laptop 2-Column Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Table Map Grid Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* Area Filter Tabs */}
          <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl shadow-xs border border-slate-200/60">
            <div className="flex items-center gap-2">
              {['Semua Area', 'Indoor Main', 'Outdoor Terrace', 'VIP Lounge'].map(area => {
                const areaKey = area === 'Semua Area' ? 'Semua' : area;
                return (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(areaKey)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedArea === areaKey
                        ? 'bg-[#C85A32] text-white shadow-sm'
                        : 'bg-[#FAF7F2] text-[#78716C] hover:bg-slate-200'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-[#78716C] font-mono font-bold px-3">
              Menampilkan {filteredTables.length} Meja
            </span>
          </div>

          {/* Table Grid (4 Columns Tablet, 5-6 Columns Laptop) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTables.map(table => {
              const isOpen = table.status === 'open';
              const isOccupied = table.status === 'occupied';
              const isClosed = table.status === 'closed';
              const isSelected = selectedTable?.id === table.id;

              return (
                <motion.div
                  key={table.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTable(table)}
                  className={`
                    p-4.5 rounded-[24px] cursor-pointer relative flex flex-col justify-between min-h-[155px] transition-all shadow-md
                    ${isOpen ? 'bg-white text-[#1C1917] hover:shadow-xl' : ''}
                    ${isOccupied ? 'bg-gradient-to-br from-[#2C221E] via-[#382B25] to-[#2C221E] text-white shadow-xl' : ''}
                    ${isClosed ? 'bg-slate-200 text-slate-500 opacity-80' : ''}
                    ${isSelected ? 'ring-4 ring-[#C85A32] shadow-2xl scale-[1.02]' : ''}
                  `}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-display font-extrabold text-base block leading-tight">
                        {table.label}
                      </span>
                      <span className={`text-[11px] font-medium flex items-center gap-1 mt-0.5 ${isOccupied ? 'text-white/70' : 'text-[#78716C]'}`}>
                        <Users className="w-3.5 h-3.5" /> {table.capacity} Kursi
                      </span>
                    </div>

                    {/* Status Badge */}
                    {isOpen && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> OPEN
                      </span>
                    )}
                    {isOccupied && (
                      <span className="bg-[#C85A32] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <AlertCircle className="w-3 h-3" /> TERISI
                      </span>
                    )}
                    {isClosed && (
                      <span className="bg-slate-400 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> TUTUP
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="mt-4 pt-2.5 border-t border-current/10">
                    {isOpen && (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        Siap Diisi Tamu
                      </span>
                    )}

                    {isOccupied && (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-amber-200 font-bold truncate max-w-[100px]">{table.customerName || 'Tamu'}</span>
                          <span className="text-white/70 text-[11px]">{table.itemsCount} items</span>
                        </div>
                        <span className="font-mono font-extrabold text-sm text-white block">
                          Rp {formatRupiah(table.totalAmount)}
                        </span>
                      </div>
                    )}

                    {isClosed && (
                      <span className="text-xs text-slate-500 font-medium">
                        Reservasi / Dibersihkan
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side Panel: Tablet / Laptop Fixed Selected Table Details Drawer */}
        <div className="w-80 lg:w-96 bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-xl flex-shrink-0">
          {selectedTable ? (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header Selected Table */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-extrabold text-lg text-[#1C1917]">
                        {selectedTable.label}
                      </h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        selectedTable.status === 'open' ? 'bg-emerald-100 text-emerald-800' :
                        selectedTable.status === 'occupied' ? 'bg-[#C85A32] text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {selectedTable.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      Area {selectedTable.area} • Kapasitas {selectedTable.capacity} Orang
                    </p>
                  </div>
                </div>

                {/* Status Details Card */}
                {selectedTable.status === 'occupied' && (
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl space-y-2.5 border border-slate-200/60">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#78716C]">Pemesan:</span>
                      <span className="font-bold text-[#1C1917]">{selectedTable.customerName || 'Tamu'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#78716C]">Order ID:</span>
                      <span className="font-mono text-[#C85A32] font-bold">{selectedTable.orderId}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#78716C]">Jumlah Pesanan:</span>
                      <span className="font-bold text-[#1C1917]">{selectedTable.itemsCount} Items</span>
                    </div>
                    <hr className="border-slate-200 my-1" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#1C1917]">Running Total:</span>
                      <span className="font-mono font-extrabold text-base text-[#C85A32]">Rp {formatRupiah(selectedTable.totalAmount)}</span>
                    </div>
                  </div>
                )}

                {selectedTable.status === 'open' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-800 text-sm">Meja Ini Kosong & Ready</h4>
                    <p className="text-xs text-emerald-600">Klik tombol di bawah untuk membukanya dan langsung menginput pesanan tamu.</p>
                  </div>
                )}

                {selectedTable.status === 'closed' && (
                  <div className="bg-slate-100 p-4 rounded-2xl text-center space-y-1">
                    <Lock className="w-8 h-8 text-slate-500 mx-auto" />
                    <h4 className="font-bold text-slate-700 text-sm">Meja Sedang Ditutup</h4>
                    <p className="text-xs text-slate-500">Meja ini tidak dapat diisi sebelum dibuka kembali oleh staf.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons Stack */}
              <div className="space-y-2.5 pt-4">
                {selectedTable.status === 'open' && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateTableStatus(selectedTable.id, 'occupied', 'Pelanggan Meja ' + selectedTable.id, 0, 0);
                        onSelectTableAndOrder(selectedTable.id);
                      }}
                      className="w-full bg-gradient-to-r from-[#C85A32] to-[#E8703E] text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg text-xs tracking-wider uppercase"
                    >
                      <ShoppingBag className="w-4 h-4" /> Buka Meja & Input Pesanan
                    </button>
                    <button
                      onClick={() => handleUpdateTableStatus(selectedTable.id, 'closed')}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs"
                    >
                      <Lock className="w-4 h-4" /> Tandai Tutup / Reservasi
                    </button>
                  </>
                )}

                {selectedTable.status === 'occupied' && (
                  <>
                    <button
                      onClick={() => {
                        onSelectTableAndOrder(selectedTable.id);
                      }}
                      className="w-full bg-[#C85A32] text-white font-extrabold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md uppercase tracking-wider"
                    >
                      <Plus className="w-4 h-4" /> Tambah Pesanan Ke Meja Ini
                    </button>

                    <button
                      onClick={() => setShowMoveModal(true)}
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
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Buka Kembali Meja (Tersedia)
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <LayoutGrid className="w-12 h-12 mb-2 stroke-1" />
              <p className="text-xs font-bold">Pilih meja pada denah di sebelah kiri untuk melihat aksi & detail pesanan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Transfer / Move Table Modal */}
      <AnimatePresence>
        {showMoveModal && selectedTable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 text-center shadow-2xl">
              <h3 className="font-display font-extrabold text-base text-[#1C1917]">
                Pindah Pesanan Dari {selectedTable.label}
              </h3>
              <p className="text-xs text-[#78716C]">
                Pilih meja tujuan yang masih kosong (OPEN) untuk mentransfer orderan ini:
              </p>

              <select
                value={targetMoveTableId}
                onChange={(e) => setTargetMoveTableId(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 font-bold text-xs bg-[#FAF7F2] text-[#1C1917] outline-none"
              >
                <option value="">-- Pilih Meja Tujuan --</option>
                {tables.filter(t => t.status === 'open').map(t => (
                  <option key={t.id} value={t.id}>
                    {t.label} ({t.area} • {t.capacity} Kursi)
                  </option>
                ))}
              </select>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowMoveModal(false)}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-100 font-bold text-xs text-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleMoveTable(selectedTable.id, targetMoveTableId)}
                  disabled={!targetMoveTableId}
                  className="flex-1 py-3.5 rounded-2xl bg-[#C85A32] disabled:bg-slate-300 font-bold text-xs text-white shadow-md"
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
