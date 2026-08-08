import React, { useState, useEffect } from 'react';
import HeaderBar from './components/HeaderBar';
import HeroBanner from './components/HeroBanner';
import CategoryGrid from './components/CategoryGrid';
import MenuGrid from './components/MenuGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartFloatingBar from './components/CartFloatingBar';
import CheckoutBottomSheet from './components/CheckoutBottomSheet';
import OrderSuccessScreen from './components/OrderSuccessScreen';
import TablePromptModal from './components/TablePromptModal';
import PaymentGatewayModal from './components/PaymentGatewayModal';
import CameraQRScannerModal from './components/CameraQRScannerModal';
import GetStartedScreen from './components/GetStartedScreen';

// POS Staff Dashboard
import PosDashboard from './pos/PosDashboard';

// Shared Initial Data
import { menus as initialMenus, categories as initialCategories } from './data/menuData';

const INITIAL_TABLES_DATA = [
  { id: '01', area: 'Indoor Main', label: 'Meja 01', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null, items: [] },
  { id: '02', area: 'Indoor Main', label: 'Meja 02', capacity: 4, status: 'occupied', customerName: 'Andi', totalAmount: 72000, itemsCount: 3, orderId: 'ORD-8821', items: [] },
  { id: '03', area: 'Indoor Main', label: 'Meja 03', capacity: 4, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null, items: [] },
  { id: '04', area: 'Indoor Main', label: 'Meja 04', capacity: 6, status: 'closed', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null, items: [] },
  { id: '05', area: 'Indoor Main', label: 'Meja 05', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null, items: [] },
  { id: '08', area: 'Indoor Main', label: 'Meja 08', capacity: 4, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null, items: [] },
  { id: 'OUT-01', area: 'Outdoor Terrace', label: 'Terrace 01', capacity: 2, status: 'open', customerName: '', totalAmount: 0, itemsCount: 0, orderId: null, items: [] },
  { id: 'VIP-01', area: 'VIP Lounge', label: 'VIP Room 1', capacity: 8, status: 'occupied', customerName: 'Bpk. Hendra', totalAmount: 340000, itemsCount: 12, orderId: 'ORD-8800', items: [] },
];

export default function App() {
  const [appMode, setAppMode] = useState('customer'); // 'customer' | 'pos'

  // Central Shared State across POS & Customer
  const [menus, setMenus] = useState(initialMenus);
  const [categories, setCategories] = useState(initialCategories);
  const [tables, setTables] = useState(INITIAL_TABLES_DATA);
  const [pendingOrdersList, setPendingOrdersList] = useState([]);

  // Customer State
  const [activePage, setActivePage] = useState('get-started');
  const [activeSlug, setActiveSlug] = useState('signature-coffee');
  const [tableNumber, setTableNumber] = useState('08');
  const [showTableModal, setShowTableModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);

  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get('table') || localStorage.getItem('kiri_table_number');
    if (table) {
      setTableNumber(table);
    }
    const initialCat = urlParams.get('category');
    if (initialCat) {
      setActiveSlug(initialCat);
      setActivePage('menu-items');
    }
    const mode = urlParams.get('mode');
    if (mode === 'pos') {
      setAppMode('pos');
    }
  }, []);

  // POS Menu & Stock Management Handlers
  const handleToggleAvailability = (menuId) => {
    setMenus(prevMenus => prevMenus.map(m => {
      if (m.id === menuId) {
        return { ...m, is_available: m.is_available === false ? true : false };
      }
      return m;
    }));
  };

  const handleUpdatePrice = (menuId, newPrice) => {
    setMenus(prevMenus => prevMenus.map(m => {
      if (m.id === menuId) {
        return { ...m, price: newPrice };
      }
      return m;
    }));
  };

  const handleAddNewMenu = (newMenuObj) => {
    setMenus(prevMenus => [newMenuObj, ...prevMenus]);
  };

  const handleSaveTable = (table) => {
    setTableNumber(table);
    localStorage.setItem('kiri_table_number', table);
    setShowTableModal(false);
  };

  const handleCameraScanSuccess = (scannedTable) => {
    handleSaveTable(scannedTable);
    if (activePage === 'get-started') {
      setActivePage('categories');
    }
  };

  const handleGetStartedClick = () => {
    setActivePage('categories');
    setShowTableModal(true);
  };

  const handleSelectCategory = (slug) => {
    setActiveSlug(slug);
    setActivePage('menu-items');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToCategories = () => {
    setActivePage('categories');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenDetail = (menu) => {
    if (menu.is_available === false) return;
    setSelectedMenu(menu);
    setIsDetailOpen(true);
  };

  const handleAddToCart = (menu, customizations, notes, extraPrice, quantity) => {
    const unitPrice = menu.price + (extraPrice || 0);
    const key = `${menu.id}_${JSON.stringify(customizations)}_${notes}`;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.key === key);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, {
          key,
          menu_id: menu.id,
          menu,
          customizations,
          notes,
          extra_price: extraPrice,
          unit_price: unitPrice,
          quantity
        }];
      }
    });
  };

  const handleUpdateCartQty = (index, delta) => {
    setCart(prevCart => {
      const updated = [...prevCart];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  // Submit Order from Customer Side -> Sync to Cashier & Table Map!
  const handleSubmitOrder = async (orderData) => {
    const newOrderObj = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table_number: orderData.table_number,
      customer_name: orderData.customer_name || 'Pelanggan Meja ' + orderData.table_number,
      payment_method: orderData.payment_method,
      items: orderData.items,
      rawSubtotal: orderData.rawSubtotal,
      appliedPromo: orderData.appliedPromo,
      promoLabel: orderData.promoLabel,
      discountAmount: orderData.discountAmount,
      taxAmount: orderData.taxAmount,
      totalPrice: orderData.totalPrice,
      created_at: new Date()
    };

    // 1. Sync Table Status in Table Map to OCCUPIED
    setTables(prevTables => prevTables.map(t => {
      if (t.id === orderData.table_number || t.label.includes(orderData.table_number)) {
        return {
          ...t,
          status: 'occupied',
          customerName: newOrderObj.customer_name,
          totalAmount: newOrderObj.totalPrice,
          itemsCount: newOrderObj.items.reduce((sum, i) => sum + i.quantity, 0),
          orderId: newOrderObj.id,
          items: newOrderObj.items
        };
      }
      return t;
    }));

    // 2. Add to Cashier Pending Orders List
    setPendingOrdersList(prev => [newOrderObj, ...prev]);

    setPendingOrderData(newOrderObj);
    setIsCheckoutOpen(false);
    setIsPaymentGatewayOpen(true);
  };

  const handlePaymentSuccess = () => {
    setConfirmedOrder(pendingOrderData);
    setCart([]);
    setIsPaymentGatewayOpen(false);
    setActivePage('success');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNewOrder = () => {
    setConfirmedOrder(null);
    setActivePage('categories');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // -------------------------------------------------------------
  // RENDER STAFF POS MODE (Full Widescreen width for Tablet & Laptop)
  // -------------------------------------------------------------
  if (appMode === 'pos') {
    return (
      <div className="w-full min-h-screen bg-[#FAF7F2] relative overflow-x-hidden">
        <PosDashboard
          menus={menus}
          categories={categories}
          tables={tables}
          setTables={setTables}
          pendingOrdersList={pendingOrdersList}
          onToggleAvailability={handleToggleAvailability}
          onUpdatePrice={handleUpdatePrice}
          onAddNewMenu={handleAddNewMenu}
          onSwitchToCustomerMode={() => setAppMode('customer')}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER CUSTOMER MODE (Mobile-First View)
  // -------------------------------------------------------------
  if (activePage === 'get-started') {
    return (
      <div className="w-full max-w-md mx-auto bg-[#FAF7F2] min-h-screen shadow-2xl relative overflow-hidden">
        <GetStartedScreen
          onGetStarted={handleGetStartedClick}
        />
      </div>
    );
  }

  if (activePage === 'success') {
    return (
      <div className="w-full max-w-md mx-auto bg-[#FAF7F2] min-h-screen shadow-2xl relative overflow-hidden">
        <OrderSuccessScreen order={confirmedOrder} onNewOrder={handleNewOrder} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#FAF7F2] min-h-screen shadow-2xl relative flex flex-col pb-24 overflow-x-hidden">
      {/* Header Bar with POS Staff Switcher */}
      <HeaderBar
        tableNumber={tableNumber}
        onPromptTable={() => setShowTableModal(true)}
        onOpenTableMap={() => setAppMode('pos')}
        onOpenScanner={() => setShowScannerModal(true)}
      />

      {/* Main Pages */}
      {activePage === 'categories' ? (
        <div key="page-categories" className="animate-fade-in gpu-accelerated">
          <HeroBanner />
          <CategoryGrid onSelectCategory={handleSelectCategory} />
        </div>
      ) : (
        <div key="page-menu-items" className="gpu-accelerated">
          <MenuGrid
            activeSlug={activeSlug}
            menus={menus}
            onBack={handleBackToCategories}
            onOpenDetail={handleOpenDetail}
          />
        </div>
      )}

      {/* Floating Cart Bar */}
      <CartFloatingBar cart={cart} onOpenCheckout={() => setIsCheckoutOpen(true)} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        menu={selectedMenu}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Bottom Sheet */}
      <CheckoutBottomSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        tableNumber={tableNumber}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentGatewayOpen}
        onClose={() => setIsPaymentGatewayOpen(false)}
        orderData={pendingOrderData}
        onPaymentSuccess={handlePaymentSuccess}
        onOpenScanner={() => setShowScannerModal(true)}
      />

      {/* Camera QR Scanner Modal */}
      <CameraQRScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={handleCameraScanSuccess}
      />

      {/* Table Number Modal */}
      <TablePromptModal
        isOpen={showTableModal}
        currentTable={tableNumber}
        onSave={handleSaveTable}
      />
    </div>
  );
}
