import React, { useState } from 'react';
import { LayoutGrid, Utensils, QrCode, LogOut, Coffee, Monitor, Store } from 'lucide-react';
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
      {/* Widescreen Tablet / Laptop POS Top Header Bar */}
      <div className="bg-[#1C1917] text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C85A32] flex items-center justify-center text-white font-extrabold text-xs shadow-md">
              POS
            </div>
            <div>
              <h2 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">
                DUMP CAFE STAFF POS TERMINAL
              </h2>
              <p className="text-[10px] text-amber-200 font-mono flex items-center gap-1">
                <Store className="w-3 h-3 text-amber-300" /> Outlet 01 — Cilegon Main Branch
              </p>
            </div>
          </div>

          {/* Desktop Tab Switcher Header Pills */}
          <div className="hidden md:flex items-center bg-white/10 p-1 rounded-2xl border border-white/15 ml-4">
            <button
              onClick={() => setPosTab('table-map')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                posTab === 'table-map'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Peta Meja
            </button>

            <button
              onClick={() => setPosTab('menu-mgmt')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                posTab === 'menu-mgmt'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Utensils className="w-4 h-4" /> Kelola Menu & Stok
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToCustomerMode}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-white/20 shadow-xs"
          >
            <QrCode className="w-4 h-4 text-amber-300" /> Switch To Customer Mode
          </button>
        </div>
      </div>

      {/* Main Widescreen Content */}
      <div className="flex-1">
        {posTab === 'table-map' ? (
          <TableManagementView
            currentActiveTable="08"
            onSelectTableAndOrder={(tableId) => {
              alert(`Meja ${tableId} dipilih di POS Terminal Tablet. Membuka menu transaksi...`);
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

      {/* Mobile/Tablet Bottom POS Navigation (Visible on mobile/tablet) */}
      <div className="md:hidden sticky bottom-0 z-40 bg-white border-t border-slate-200 px-6 py-2 shadow-2xl flex items-center justify-around">
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
