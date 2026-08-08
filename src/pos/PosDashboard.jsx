import React, { useState } from 'react';
import { LayoutGrid, Utensils, QrCode, LogOut, Coffee } from 'lucide-react';
import TableManagementView from '../components/TableManagementView';
import MenuManagementView from './MenuManagementView';

export default function PosDashboard({
  menus,
  categories,
  onToggleAvailability,
  onUpdatePrice,
  onAddNewMenu,
  onSwitchToCustomerMode
}) {
  const [posTab, setPosTab] = useState('table-map'); // 'table-map' | 'menu-mgmt'

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-brand select-none flex flex-col justify-between">
      {/* Top Banner Navigation Bar */}
      <div className="bg-[#1C1917] text-white p-3 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#C85A32] flex items-center justify-center text-white font-extrabold text-xs">
            POS
          </div>
          <div>
            <h2 className="font-display font-extrabold text-xs text-white uppercase tracking-wider">
              DUMP CAFE STAFF TERMINAL
            </h2>
            <p className="text-[9px] text-amber-200 font-mono">
              Cashier & Manager Backoffice
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToCustomerMode}
          className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors border border-white/20"
        >
          <QrCode className="w-3.5 h-3.5 text-amber-300" /> Mode QR Pelanggan
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1">
        {posTab === 'table-map' ? (
          <TableManagementView
            currentActiveTable="08"
            onSelectTableAndOrder={(tableId) => {
              alert(`Meja ${tableId} dipilih di POS Terminal. Membuka menu transaksi...`);
            }}
            onCloseMap={() => setPosTab('menu-mgmt')}
          />
        ) : (
          <MenuManagementView
            menus={menus}
            categories={categories}
            onToggleAvailability={onToggleAvailability}
            onUpdatePrice={onUpdatePrice}
            onAddNewMenu={onAddNewMenu}
            onClose={() => setPosTab('table-map')}
          />
        )}
      </div>

      {/* Bottom POS Navigation Bar */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-slate-200 px-6 py-2 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setPosTab('table-map')}
          className={`flex flex-col items-center gap-1 text-xs font-extrabold transition-all ${
            posTab === 'table-map' ? 'text-[#C85A32]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Peta Meja</span>
        </button>

        <button
          onClick={() => setPosTab('menu-mgmt')}
          className={`flex flex-col items-center gap-1 text-xs font-extrabold transition-all ${
            posTab === 'menu-mgmt' ? 'text-[#C85A32]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span>Kelola Menu & Stok</span>
        </button>
      </div>
    </div>
  );
}
