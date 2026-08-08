import React, { useState } from 'react';
import { LayoutGrid, Utensils, QrCode, ShoppingBag, Store, ShieldCheck, UserCheck, Lock } from 'lucide-react';
import TableManagementView from '../components/TableManagementView';
import MenuManagementView from './MenuManagementView';
import CashierPosTerminalView from './CashierPosTerminalView';

export default function PosDashboard({
  menus,
  categories,
  onToggleAvailability,
  onUpdatePrice,
  onAddNewMenu,
  onSwitchToCustomerMode
}) {
  // Role State: 'cashier' | 'manager' | 'owner'
  const [currentRole, setCurrentRole] = useState('cashier');
  const [posTab, setPosTab] = useState('pos-terminal'); // 'pos-terminal' | 'table-map' | 'menu-mgmt'

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-brand select-none flex flex-col justify-between">
      {/* Widescreen Tablet / Laptop POS Top Header Bar */}
      <div className="bg-[#1C1917] text-white px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
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

          {/* Role Switcher Pill */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/15">
            <span className="text-[10px] text-white/60 font-bold px-2 uppercase">Role:</span>
            <button
              onClick={() => setCurrentRole('cashier')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                currentRole === 'cashier' ? 'bg-emerald-600 text-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              👤 Kasir
            </button>
            <button
              onClick={() => setCurrentRole('manager')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                currentRole === 'manager' ? 'bg-[#C85A32] text-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              👔 Manager
            </button>
          </div>
        </div>

        {/* Desktop Tab Switcher Header Pills */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center bg-white/10 p-1 rounded-2xl border border-white/15">
            <button
              onClick={() => setPosTab('pos-terminal')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                posTab === 'pos-terminal'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Terminal Kasir
            </button>

            <button
              onClick={() => setPosTab('table-map')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                posTab === 'table-map'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Peta Meja
            </button>

            {/* Menu Management Tab — Restricted for Cashier role */}
            <button
              onClick={() => {
                if (currentRole === 'cashier') {
                  alert('Akses Terkunci! Hanya Manager / Owner yang dapat mengedit menu & harga. Ganti role ke Manager di bar atas untuk mencoba.');
                  return;
                }
                setPosTab('menu-mgmt');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                posTab === 'menu-mgmt'
                  ? 'bg-[#C85A32] text-white shadow-sm'
                  : currentRole === 'cashier' ? 'text-white/30 cursor-not-allowed' : 'text-white/70 hover:text-white'
              }`}
            >
              <Utensils className="w-4 h-4" /> Kelola Menu {currentRole === 'cashier' && <Lock className="w-3 h-3 text-amber-400 ml-1" />}
            </button>
          </div>

          <button
            onClick={onSwitchToCustomerMode}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors border border-white/20 shadow-xs"
          >
            <QrCode className="w-4 h-4 text-amber-300" /> Mode QR Pelanggan
          </button>
        </div>
      </div>

      {/* Main Widescreen Content */}
      <div className="flex-1">
        {posTab === 'pos-terminal' && (
          <CashierPosTerminalView
            menus={menus}
            categories={categories}
            currentRole={currentRole}
            activeTableNumber="08"
          />
        )}

        {posTab === 'table-map' && (
          <TableManagementView
            currentActiveTable="08"
            onSelectTableAndOrder={(tableId) => {
              setPosTab('pos-terminal');
            }}
            onCloseMap={() => setPosTab('pos-terminal')}
          />
        )}

        {posTab === 'menu-mgmt' && currentRole !== 'cashier' && (
          <MenuManagementView
            menus={menus}
            categories={categories}
            onToggleAvailability={onToggleAvailability}
            onUpdatePrice={onUpdatePrice}
            onAddNewMenu={onAddNewMenu}
            onClose={() => setPosTab('pos-terminal')}
          />
        )}
      </div>

      {/* Mobile/Tablet Bottom POS Navigation */}
      <div className="md:hidden sticky bottom-0 z-40 bg-white border-t border-slate-200 px-4 py-2 shadow-2xl flex items-center justify-around">
        <button
          onClick={() => setPosTab('pos-terminal')}
          className={`flex flex-col items-center gap-1 text-[11px] font-extrabold transition-all ${
            posTab === 'pos-terminal' ? 'text-[#C85A32]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Kasir POS</span>
        </button>

        <button
          onClick={() => setPosTab('table-map')}
          className={`flex flex-col items-center gap-1 text-[11px] font-extrabold transition-all ${
            posTab === 'table-map' ? 'text-[#C85A32]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span>Peta Meja</span>
        </button>

        <button
          onClick={() => {
            if (currentRole === 'cashier') {
              alert('Akses Terkunci! Hanya Manager / Owner yang dapat mengedit menu & harga. Ganti role ke Manager di bar atas untuk mencoba.');
              return;
            }
            setPosTab('menu-mgmt');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-extrabold transition-all ${
            posTab === 'menu-mgmt' ? 'text-[#C85A32]' : currentRole === 'cashier' ? 'text-slate-300' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span>Kelola Menu</span>
        </button>
      </div>
    </div>
  );
}
