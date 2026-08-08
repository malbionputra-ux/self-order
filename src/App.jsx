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
import TableManagementView from './components/TableManagementView';

export default function App() {
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
  }, []);

  const handleSaveTable = (table) => {
    setTableNumber(table);
    localStorage.setItem('kiri_table_number', table);
    setShowTableModal(false);
  };

  const handleSelectTableFromMapAndOrder = (selectedTableId) => {
    handleSaveTable(selectedTableId);
    setActivePage('categories');
    window.scrollTo({ top: 0, behavior: 'instant' });
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

  const handleSubmitOrder = async (orderData) => {
    setPendingOrderData({
      id: Math.floor(100 + Math.random() * 900),
      table_number: orderData.table_number,
      customer_name: orderData.customer_name,
      payment_method: orderData.payment_method,
      items: orderData.items,
      rawSubtotal: orderData.rawSubtotal,
      appliedPromo: orderData.appliedPromo,
      promoLabel: orderData.promoLabel,
      discountAmount: orderData.discountAmount,
      taxAmount: orderData.taxAmount,
      totalPrice: orderData.totalPrice,
      created_at: new Date()
    });
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

  if (activePage === 'table-map') {
    return (
      <div className="w-full max-w-md mx-auto bg-[#FAF7F2] min-h-screen shadow-2xl relative overflow-hidden">
        <TableManagementView
          currentActiveTable={tableNumber}
          onSelectTableAndOrder={handleSelectTableFromMapAndOrder}
          onCloseMap={() => setActivePage('categories')}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#FAF7F2] min-h-screen shadow-2xl relative flex flex-col pb-24 overflow-x-hidden">
      {/* Header Bar */}
      <HeaderBar
        tableNumber={tableNumber}
        onPromptTable={() => setShowTableModal(true)}
        onOpenTableMap={() => setActivePage('table-map')}
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
