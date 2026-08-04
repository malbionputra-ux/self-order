import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

export default function App() {
  const [activePage, setActivePage] = useState('get-started'); // 'get-started' | 'categories' | 'menu-items' | 'success'
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setActivePage('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewOrder = () => {
    setConfirmedOrder(null);
    setActivePage('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activePage === 'get-started') {
    return (
      <div className="w-full max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden">
        <GetStartedScreen 
          onGetStarted={handleGetStartedClick}
        />
      </div>
    );
  }

  if (activePage === 'success') {
    return (
      <div className="w-full max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden">
        <OrderSuccessScreen order={confirmedOrder} onNewOrder={handleNewOrder} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col pb-24 overflow-x-hidden">
      {/* Header Bar */}
      <HeaderBar 
        tableNumber={tableNumber} 
        onPromptTable={() => setShowTableModal(true)}
        onOpenScanner={() => setShowScannerModal(true)}
      />

      {/* Main Pages with AnimatePresence */}
      <AnimatePresence mode="wait">
        {activePage === 'categories' ? (
          <motion.div
            key="page-categories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroBanner />
            <CategoryGrid onSelectCategory={handleSelectCategory} />
          </motion.div>
        ) : (
          <motion.div
            key="page-menu-items"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <MenuGrid 
              activeSlug={activeSlug} 
              onBack={handleBackToCategories} 
              onOpenDetail={handleOpenDetail} 
            />
          </motion.div>
        )}
      </AnimatePresence>

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
      />

      {/* Camera QR Code Scanner Modal */}
      <CameraQRScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onScanSuccess={handleCameraScanSuccess}
      />

      {/* Table Number Prompt Modal */}
      <TablePromptModal
        isOpen={showTableModal}
        currentTable={tableNumber}
        onSave={handleSaveTable}
      />
    </div>
  );
}
