const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// In-Memory Database to mimic Laravel Eloquent Models
const categories = [
    { id: 1, name: 'Mie Pedas', slug: 'mie-pedas' },
    { id: 2, name: 'Dimsum', slug: 'dimsum' },
    { id: 3, name: 'Es & Minuman', slug: 'es-minuman' }
];

const menus = [
    // Mie Pedas
    { id: 1, category_id: 1, name: 'Mie Hompimpa', description: 'Mie asin gurih khas Gacoan dengan pangsit goreng renyah & taburan ayam lembut.', price: 10500, image: '/images/mie_hompimpa.png', has_spicy_levels: true, category: categories[0] },
    { id: 2, category_id: 1, name: 'Mie Iblis', description: 'Mie manis pedas gurih dengan taburan cabai asli, pangsit renyah & daging ayam.', price: 10500, image: '/images/mie_iblis.png', has_spicy_levels: true, category: categories[0] },
    { id: 3, category_id: 1, name: 'Mie Gacoan', description: 'Signature mie manis pedas khas Gacoan dengan topping ayam cincang & pangsit goreng.', price: 10500, image: '/images/mie_gacoan.png', has_spicy_levels: true, category: categories[0] },
    { id: 4, category_id: 1, name: 'Mie Suit', description: 'Mie asin gurih tanpa cabai (non-pedas), cocok untuk yang suka rasa asli gurih.', price: 10500, image: '/images/mie_hompimpa.png', has_spicy_levels: false, category: categories[0] },
    { id: 5, category_id: 1, name: 'Mie Angel', description: 'Mie original gurih lezat bertabur ayam cincang tanpa minyak pedas.', price: 9500, image: '/images/mie_hompimpa.png', has_spicy_levels: false, category: categories[0] },
    // Dimsum
    { id: 6, category_id: 2, name: 'Udang Keju', description: 'Dimsum goreng balut tepung renyah isi udang gurih & lelehan keju mozarella.', price: 9500, image: '/images/udang_keju.png', has_spicy_levels: false, category: categories[1] },
    { id: 7, category_id: 2, name: 'Siomay Ayam', description: 'Siomay kukus lembut olahan daging ayam pilihan disajikan hangat.', price: 9500, image: '/images/siomay_ayam.png', has_spicy_levels: false, category: categories[1] },
    { id: 8, category_id: 2, name: 'Pangsit Goreng', description: 'Pangsit goreng garing renyah khas Gacoan isi olahan daging ayam gurih.', price: 9500, image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300', has_spicy_levels: false, category: categories[1] },
    { id: 9, category_id: 2, name: 'Lumpia Udang', description: 'Lumpia kulit renyah isi udang lembut dan bumbu rempah spesial.', price: 9500, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300', has_spicy_levels: false, category: categories[1] },
    // Es & Minuman
    { id: 10, category_id: 3, name: 'Es Gobak Sodor', description: 'Es buah segar legendaris perpaduan jelly tropis, buah manis, sirup & susu gurih.', price: 8500, image: '/images/es_gobak_sodor.png', has_spicy_levels: false, category: categories[2] },
    { id: 11, category_id: 3, name: 'Es Teklek', description: 'Es ramuan buah naga & susu manis segar pencuci mulut dingin.', price: 8500, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300', has_spicy_levels: false, category: categories[2] },
    { id: 12, category_id: 3, name: 'Es Sluku Bathok', description: 'Es mocca susu kekinian dengan topping jelly kelapa kenyal.', price: 8500, image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300', has_spicy_levels: false, category: categories[2] },
    { id: 13, category_id: 3, name: 'Es Teh Manis Jumbo', description: 'Es teh manis aroma melati segar porsi jumbo pelepas dahaga.', price: 4500, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', has_spicy_levels: false, category: categories[2] },
    { id: 14, category_id: 3, name: 'Lemon Tea Segar', description: 'Es teh dengan perasan jeruk lemon asli yang menyegarkan.', price: 6000, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300', has_spicy_levels: false, category: categories[2] },
    { id: 15, category_id: 3, name: 'Air Mineral Cold', description: 'Air mineral kemasan dingin 600ml.', price: 4000, image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=300', has_spicy_levels: false, category: categories[2] }
];

const orders = [];
let nextOrderId = 1;

function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Serve Static Files (Images)
    if (pathname.startsWith('/images/')) {
        const filePath = path.join(PUBLIC_DIR, pathname);
        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.svg': 'image/svg+xml'
            };
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
            return fs.createReadStream(filePath).pipe(res);
        }
    }

    // GET / (Index page)
    if (pathname === '/' && req.method === 'GET') {
        const tableNumber = parsedUrl.query.table || '14';
        const html = renderIndexPage(tableNumber);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(html);
    }

    // POST /order (Create Order)
    if ((pathname === '/order' || pathname === '/api/order') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                let rawSubtotal = 0;
                const orderItems = [];

                data.items.forEach(item => {
                    const menu = menus.find(m => m.id === item.menu_id);
                    if (menu) {
                        const qty = item.quantity;
                        const subtotal = menu.price * qty;
                        rawSubtotal += subtotal;
                        orderItems.push({
                            menu: menu,
                            spiciness_level: item.spiciness_level,
                            notes: item.notes,
                            quantity: qty,
                            unit_price: menu.price,
                            subtotal: subtotal
                        });
                    }
                });

                const taxAmount = Math.round(rawSubtotal * 0.10);
                const totalPrice = rawSubtotal + taxAmount;

                const newOrder = {
                    id: nextOrderId++,
                    table_number: data.table_number || '14',
                    customer_name: data.customer_name || 'Pelanggan',
                    total_price: totalPrice,
                    tax_amount: taxAmount,
                    payment_method: data.payment_method || 'qris',
                    status: 'pending',
                    items: orderItems,
                    created_at: new Date()
                };

                orders.push(newOrder);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    order_id: newOrder.id,
                    redirect_url: `/order/${newOrder.id}/success`
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, message: 'Invalid data' }));
            }
        });
        return;
    }

    // GET /order/:id/success
    const successMatch = pathname.match(/^\/order\/(\d+)\/success$/);
    if (successMatch && req.method === 'GET') {
        const orderId = parseInt(successMatch[1]);
        const order = orders.find(o => o.id === orderId);
        if (order) {
            const html = renderSuccessPage(order);
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return res.end(html);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('<h1>Pesanan tidak ditemukan</h1>');
        }
    }

    // Fallback 404
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
});

function renderIndexPage(tableNumber) {
    const categoriesHtml = categories.map(cat => `
        <button class="cat-btn" data-category="${cat.slug}" onclick="filterCategory('${cat.slug}', this)">
            ${cat.name}
        </button>
    `).join('');

    const sectionsHtml = categories.map(cat => {
        const catMenus = menus.filter(m => m.category_id === cat.id);
        const menusHtml = catMenus.map(menu => `
            <div class="menu-card" data-category="${cat.slug}">
                <img src="${menu.image}" alt="${menu.name}" class="menu-img" onerror="this.src='https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200'">
                <div class="menu-info">
                    <h3 class="menu-title">${menu.name}${menu.has_spicy_levels ? ' <span class="badge-spicy">🌶️ Pedas</span>' : ''}</h3>
                    <p class="menu-desc">${menu.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="menu-price">Rp ${formatRupiah(menu.price)}</span>
                        <button class="btn btn-gacoan btn-sm px-3 py-1" onclick="${menu.has_spicy_levels ? `openSpicyModal(${JSON.stringify(menu).replace(/"/g, '&quot;')})` : `addToCartDirect(${JSON.stringify(menu).replace(/"/g, '&quot;')})`}">
                            + Tambah
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        return `
            <div class="category-section mb-4" id="cat-section-${cat.slug}">
                <h2 class="h6 fw-bold mb-3 text-secondary d-flex align-items-center gap-2">
                    <span class="bg-danger rounded-circle d-inline-block" style="width: 8px; height: 8px;"></span>
                    ${cat.name} (${catMenus.length})
                </h2>
                ${menusHtml}
            </div>
        `;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Mie Gacoan - Self Ordering (Tanpa Login)</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        :root {
            --gacoan-magenta: #E60067;
            --gacoan-magenta-dark: #C00054;
            --gacoan-magenta-light: #FFF0F5;
            --gacoan-dark: #1A1A1A;
            --gacoan-bg: #F8F9FA;
        }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #EAEAEA; margin: 0; padding: 0; display: flex; justify-content: center; min-height: 100vh; }
        .mobile-container { width: 100%; max-width: 480px; background-color: #FFFFFF; min-height: 100vh; position: relative; box-shadow: 0 0 25px rgba(0, 0, 0, 0.15); display: flex; flex-direction: column; padding-bottom: 90px; }
        .btn-gacoan { background-color: var(--gacoan-magenta); color: #FFFFFF; font-weight: 700; border-radius: 12px; border: none; transition: all 0.2s ease-in-out; }
        .btn-gacoan:hover, .btn-gacoan:active { background-color: var(--gacoan-magenta-dark); color: #FFFFFF; }
        .btn-outline-gacoan { border: 2px solid var(--gacoan-magenta); color: var(--gacoan-magenta); font-weight: 700; border-radius: 12px; background: transparent; }
        .badge-gacoan-pill { background-color: var(--gacoan-magenta); color: white; }
        .header-bar { background: linear-gradient(135deg, #E60067 0%, #B80052 100%); color: white; padding: 16px 20px; position: sticky; top: 0; z-index: 1020; box-shadow: 0 4px 12px rgba(230, 0, 103, 0.25); }
        .table-badge { background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.3); font-weight: 700; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; cursor: pointer; }
        .category-pills { display: flex; overflow-x: auto; gap: 8px; padding: 12px 16px; background: #FFFFFF; position: sticky; top: 65px; z-index: 1010; border-bottom: 1px solid #F0F0F0; }
        .category-pills::-webkit-scrollbar { display: none; }
        .cat-btn { white-space: nowrap; padding: 8px 18px; border-radius: 25px; font-size: 0.85rem; font-weight: 700; border: 1.5px solid #E0E0E0; color: #555555; background: #F8F9FA; cursor: pointer; }
        .cat-btn.active { background-color: var(--gacoan-magenta); color: #FFFFFF; border-color: var(--gacoan-magenta); box-shadow: 0 3px 8px rgba(230, 0, 103, 0.3); }
        .menu-card { border: none; border-radius: 16px; background: #FFFFFF; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04); padding: 12px; margin-bottom: 14px; display: flex; gap: 12px; align-items: center; }
        .menu-img { width: 90px; height: 90px; object-fit: cover; border-radius: 12px; }
        .menu-info { flex: 1; min-width: 0; }
        .menu-title { font-weight: 800; font-size: 0.98rem; margin-bottom: 4px; color: var(--gacoan-dark); }
        .menu-desc { font-size: 0.78rem; color: #777; margin-bottom: 8px; line-height: 1.3; }
        .menu-price { font-weight: 800; color: var(--gacoan-magenta); font-size: 0.95rem; }
        .badge-spicy { background: rgba(230,0,103,.12); color: var(--gacoan-magenta); font-size: .65rem; border-radius: 8px; padding: 2px 6px; font-weight: 700; }
        .cart-bar { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); width: calc(100% - 32px); max-width: 448px; background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%); color: white; border-radius: 18px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35); z-index: 1040; cursor: pointer; transition: transform 0.2s ease, opacity 0.2s ease; }
        .cart-bar.hidden { transform: translate(-50%, 100px); opacity: 0; pointer-events: none; }
        .spicy-selector { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .spicy-option input[type="radio"] { display: none; }
        .spicy-option label { display: block; text-align: center; padding: 10px 4px; border: 2px solid #E0E0E0; border-radius: 12px; font-weight: 700; font-size: 0.85rem; color: #444; cursor: pointer; }
        .spicy-option input[type="radio"]:checked + label { border-color: var(--gacoan-magenta); background-color: var(--gacoan-magenta-light); color: var(--gacoan-magenta); }
    </style>
</head>
<body>
    <div class="mobile-container">
        <!-- Header -->
        <div class="header-bar d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
                <i class="bi bi-fire fs-3 text-warning"></i>
                <div>
                    <h1 class="h6 mb-0 fw-bold text-white">MIE GACOAN</h1>
                    <small class="text-white-50" style="font-size: 0.72rem;">Self-Ordering (Tanpa Login)</small>
                </div>
            </div>
            <div class="table-badge d-flex align-items-center gap-1" onclick="promptTableNumber()">
                <i class="bi bi-qr-code-scan"></i> Meja #<span id="displayTableNumber">${tableNumber}</span>
                <i class="bi bi-pencil-square ms-1" style="font-size: 0.75rem;"></i>
            </div>
        </div>

        <!-- Modal Input Nomor Meja Makan -->
        <div class="modal fade" id="tablePromptModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered px-3">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                    <div class="modal-body text-center p-4">
                        <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3" style="width: 70px; height: 70px;">
                            <i class="bi bi-geo-alt-fill fs-2" style="color: var(--gacoan-magenta);"></i>
                        </div>
                        <h5 class="fw-bold text-dark mb-1">Selamat Datang di Mie Gacoan!</h5>
                        <p class="text-muted small mb-4">Masukkan nomor meja tempat Anda duduk untuk mulai memesan langsung tanpa perlu registrasi/login.</p>
                        <div class="mb-3">
                            <label class="form-label fw-bold text-secondary small">NOMOR MEJA DUDUK</label>
                            <input type="number" id="inputTableNumber" class="form-control form-control-lg text-center fw-bold fs-4" placeholder="Cth: 14" min="1" max="99" value="${tableNumber}">
                        </div>
                        <button type="button" class="btn btn-gacoan w-100 py-3 text-uppercase fw-bold" onclick="saveTableNumber()">
                            Mulai Pilih Menu <i class="bi bi-arrow-right-short fs-5"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Categories -->
        <div class="category-pills">
            <button class="cat-btn active" onclick="filterCategory('all', this)">Semua (${menus.length})</button>
            ${categoriesHtml}
        </div>

        <!-- Content -->
        <div class="p-3">
            ${sectionsHtml}
        </div>

        <!-- Floating Cart Bar -->
        <div class="cart-bar hidden" id="cartBar" onclick="openCheckoutModal()">
            <div class="d-flex align-items-center gap-3">
                <div class="position-relative">
                    <i class="bi bi-bag-check-fill fs-3 text-warning"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-gacoan-pill" id="cartTotalCount">0</span>
                </div>
                <div>
                    <div class="small text-white-50" style="font-size: 0.72rem;">Total Pesanan</div>
                    <div class="fw-extrabold fs-6" id="cartTotalPrice">Rp 0</div>
                </div>
            </div>
            <div class="d-flex align-items-center gap-1 font-weight-bold text-warning small">
                <span>Lanjut Checkout</span>
                <i class="bi bi-chevron-right fs-6"></i>
            </div>
        </div>

        <!-- Spicy Modal -->
        <div class="modal fade" id="spicyModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered px-3">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold" id="spicyMenuTitle">Pilih Level Kepedasan</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted small mb-3">Pilih tingkat kepedasan favoritmu untuk menu ini:</p>
                        <div class="spicy-selector mb-3">
                            ${['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 6', 'Level 8'].map((lvl, idx) => `
                                <div class="spicy-option">
                                    <input type="radio" name="spiciness_level" id="spicy_${lvl.replace(/\s+/g, '_')}" value="${lvl}" ${idx === 1 ? 'checked' : ''}>
                                    <label for="spicy_${lvl.replace(/\s+/g, '_')}">${lvl}</label>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mb-3">
                            <label for="spicyNotes" class="form-label fw-bold small text-secondary">Catatan Khusus (Opsional)</label>
                            <input type="text" class="form-control form-control-sm" id="spicyNotes" placeholder="Cth: Tanpa bawang goreng, kecap dipisah">
                        </div>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-gacoan w-100 py-2" onclick="confirmSpicyAddToCart()">
                            Masukkan ke Keranjang
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Checkout Canvas -->
        <div class="offcanvas offcanvas-bottom h-auto rounded-top-4" tabindex="-1" id="checkoutCanvas" style="max-width: 480px; margin: 0 auto; max-height: 90vh;">
            <div class="offcanvas-header border-bottom py-3">
                <h5 class="offcanvas-title fw-bold"><i class="bi bi-receipt text-danger me-2"></i> Ringkasan Pesanan</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body p-3">
                <form id="orderForm" onsubmit="submitOrder(event)">
                    <input type="hidden" id="formTableNumber" name="table_number" value="${tableNumber}">
                    <div class="mb-3">
                        <label class="form-label fw-bold small text-dark"><i class="bi bi-person-fill text-danger me-1"></i> Nama Pemesan</label>
                        <input type="text" name="customer_name" class="form-control" placeholder="Masukkan nama kamu..." required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold small text-dark"><i class="bi bi-cart3 text-danger me-1"></i> Item Pesanan</label>
                        <div id="checkoutItemsList" class="d-flex flex-column gap-2"></div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-bold small text-dark"><i class="bi bi-wallet2 text-danger me-1"></i> Metode Pembayaran</label>
                        <div class="d-flex gap-2 mb-2">
                            <input type="radio" class="btn-check" name="payment_method" id="pay_qris" value="qris" checked>
                            <label class="btn btn-outline-gacoan flex-fill py-2 text-center" for="pay_qris"><i class="bi bi-qr-code"></i> QRIS / Transfer</label>
                            <input type="radio" class="btn-check" name="payment_method" id="pay_kasir" value="kasir">
                            <label class="btn btn-outline-gacoan flex-fill py-2 text-center" for="pay_kasir"><i class="bi bi-cash-stack"></i> Kasir</label>
                        </div>
                        <div id="proofUploadContainer" class="bg-light p-3 rounded-3 border">
                            <label class="form-label fw-bold small text-dark mb-1"><i class="bi bi-upload text-danger me-1"></i> Unggah Bukti Pembayaran (Opsional)</label>
                            <input type="file" name="payment_proof" class="form-control form-control-sm" accept="image/*">
                            <small class="text-muted" style="font-size: 0.7rem;">Dapat diunggah sekarang atau setelah memesan.</small>
                        </div>
                    </div>

                    <div class="bg-light p-3 rounded-3 mb-3 border">
                        <div class="d-flex justify-content-between mb-1 small text-secondary">
                            <span>Subtotal</span>
                            <span id="summarySubtotal">Rp 0</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1 small text-secondary">
                            <span>Pajak Resto PB1 (10%)</span>
                            <span id="summaryTax">Rp 0</span>
                        </div>
                        <hr class="my-2">
                        <div class="d-flex justify-content-between fw-bold text-dark fs-6">
                            <span>Total Pembayaran</span>
                            <span id="summaryTotal" class="text-danger">Rp 0</span>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-gacoan w-100 py-3 text-uppercase tracking-wider fw-bold fs-6">
                        <i class="bi bi-check-circle-fill me-1"></i> Konfirmasi & Pesan Sekarang
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        let cart = [];
        let activeMenuForSpicy = null;
        let spicyBsModal = null;
        let checkoutBsCanvas = null;
        let tablePromptBsModal = null;

        document.addEventListener('DOMContentLoaded', () => {
            spicyBsModal = new bootstrap.Modal(document.getElementById('spicyModal'));
            checkoutBsCanvas = new bootstrap.Offcanvas(document.getElementById('checkoutCanvas'));
            tablePromptBsModal = new bootstrap.Modal(document.getElementById('tablePromptModal'));

            const urlParams = new URLSearchParams(window.location.search);
            let table = urlParams.get('table') || localStorage.getItem('gacoan_table_number');
            if (!table) {
                tablePromptBsModal.show();
            } else {
                setTableNumber(table);
            }
        });

        function promptTableNumber() { tablePromptBsModal.show(); }
        function saveTableNumber() {
            const val = document.getElementById('inputTableNumber').value || '14';
            setTableNumber(val);
            tablePromptBsModal.hide();
        }
        function setTableNumber(table) {
            localStorage.setItem('gacoan_table_number', table);
            document.getElementById('displayTableNumber').innerText = table;
            document.getElementById('formTableNumber').value = table;
        }

        function filterCategory(slug, btn) {
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.category-section').forEach(sec => {
                sec.style.display = (slug === 'all' || sec.id === 'cat-section-' + slug) ? 'block' : 'none';
            });
        }

        function addToCartDirect(menu) {
            addItemToCart(menu, null, '');
        }

        function openSpicyModal(menu) {
            activeMenuForSpicy = menu;
            document.getElementById('spicyMenuTitle').innerText = menu.name;
            document.getElementById('spicyNotes').value = '';
            spicyBsModal.show();
        }

        function confirmSpicyAddToCart() {
            if (!activeMenuForSpicy) return;
            const selectedLvl = document.querySelector('input[name="spiciness_level"]:checked')?.value || 'Level 1';
            const notes = document.getElementById('spicyNotes').value;
            addItemToCart(activeMenuForSpicy, selectedLvl, notes);
            spicyBsModal.hide();
        }

        function addItemToCart(menu, spicinessLevel, notes) {
            const existingIndex = cart.findIndex(item => item.menu_id === menu.id && item.spiciness_level === spicinessLevel && item.notes === notes);
            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({
                    menu_id: menu.id,
                    name: menu.name,
                    price: parseFloat(menu.price),
                    spiciness_level: spicinessLevel,
                    notes: notes,
                    quantity: 1
                });
            }
            updateCartUI();
        }

        function updateCartQuantity(index, change) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) cart.splice(index, 1);
            updateCartUI();
            renderCheckoutItems();
        }

        function updateCartUI() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const cartBar = document.getElementById('cartBar');

            if (totalItems > 0) {
                cartBar.classList.remove('hidden');
                document.getElementById('cartTotalCount').innerText = totalItems;
                document.getElementById('cartTotalPrice').innerText = 'Rp ' + formatRupiah(subtotal);
            } else {
                cartBar.classList.add('hidden');
            }
        }

        function openCheckoutModal() {
            renderCheckoutItems();
            checkoutBsCanvas.show();
        }

        function renderCheckoutItems() {
            const container = document.getElementById('checkoutItemsList');
            container.innerHTML = '';
            if (cart.length === 0) {
                container.innerHTML = '<div class="text-center text-muted py-3 small">Keranjang kamu masih kosong</div>';
                document.getElementById('summarySubtotal').innerText = 'Rp 0';
                document.getElementById('summaryTax').innerText = 'Rp 0';
                document.getElementById('summaryTotal').innerText = 'Rp 0';
                return;
            }
            let subtotal = 0;
            cart.forEach((item, index) => {
                const itemSubtotal = item.price * item.quantity;
                subtotal += itemSubtotal;
                const div = document.createElement('div');
                div.className = 'd-flex justify-content-between align-items-center p-2 border rounded-3 bg-white';
                div.innerHTML = \`
                    <div>
                        <div class="fw-bold small text-dark">\${item.name}</div>
                        <div class="text-muted" style="font-size: 0.72rem;">
                            \${item.spiciness_level ? '<span class="badge bg-danger me-1">' + item.spiciness_level + '</span>' : ''}
                            \${item.notes ? '<i>(' + item.notes + ')</i>' : ''}
                        </div>
                        <div class="text-danger fw-bold small">Rp \${formatRupiah(item.price)}</div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-outline-secondary btn-sm px-2 py-0" onclick="updateCartQuantity(\${index}, -1)">-</button>
                        <span class="fw-bold small px-1">\${item.quantity}</span>
                        <button type="button" class="btn btn-outline-danger btn-sm px-2 py-0" onclick="updateCartQuantity(\${index}, 1)">+</button>
                    </div>
                \`;
                container.appendChild(div);
            });
            const tax = Math.round(subtotal * 0.10);
            const total = subtotal + tax;
            document.getElementById('summarySubtotal').innerText = 'Rp ' + formatRupiah(subtotal);
            document.getElementById('summaryTax').innerText = 'Rp ' + formatRupiah(tax);
            document.getElementById('summaryTotal').innerText = 'Rp ' + formatRupiah(total);
        }

        function formatRupiah(number) {
            return new Intl.NumberFormat('id-ID').format(number);
        }

        async function submitOrder(e) {
            e.preventDefault();
            if (cart.length === 0) return alert('Pilih minimal 1 menu pesanan.');
            const form = e.target;
            const formData = new FormData(form);
            const payload = {
                table_number: formData.get('table_number'),
                customer_name: formData.get('customer_name'),
                payment_method: formData.get('payment_method'),
                items: cart
            };
            try {
                const response = await fetch('/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                if (data.success) {
                    window.location.href = data.redirect_url;
                } else {
                    alert('Gagal membuat pesanan.');
                }
            } catch (err) {
                console.error(err);
                alert('Terjadi kesalahan jaringan.');
            }
        }
    </script>
</body>
</html>
    `;
}

function renderSuccessPage(order) {
    const rawSubtotal = order.total_price - order.tax_amount;
    const itemsHtml = order.items.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light">
            <div>
                <div class="fw-bold small text-dark">${item.menu.name} x ${item.quantity}</div>
                <div class="text-muted" style="font-size: 0.73rem;">
                    ${item.spiciness_level ? `<span class="badge bg-danger me-1">${item.spiciness_level}</span>` : ''}
                    ${item.notes ? `<i>(${item.notes})</i>` : ''}
                </div>
            </div>
            <div class="fw-bold small text-dark">
                Rp ${formatRupiah(item.subtotal)}
            </div>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Pesanan Berhasil - Mie Gacoan</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        :root { --gacoan-magenta: #E60067; --gacoan-dark: #1A1A1A; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #EAEAEA; margin: 0; padding: 0; display: flex; justify-content: center; min-height: 100vh; }
        .mobile-container { width: 100%; max-width: 480px; background-color: #FFFFFF; min-height: 100vh; position: relative; box-shadow: 0 0 25px rgba(0,0,0,0.15); display: flex; flex-direction: column; }
        .btn-gacoan { background-color: var(--gacoan-magenta); color: #FFFFFF; font-weight: 700; border-radius: 12px; border: none; text-decoration: none; display: inline-block; }
        .step-badge { background: #e9ecef; color: #6c757d; font-size: 0.72rem; font-weight: 700; padding: 6px 12px; border-radius: 20px; }
        .step-badge.active { background: var(--gacoan-magenta); color: #fff; }
    </style>
</head>
<body>
    <div class="mobile-container p-4 text-center">
        <div class="my-4">
            <div class="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-4" style="width: 100px; height: 100px;">
                <i class="bi bi-check-circle-fill display-4" style="color: var(--gacoan-magenta);"></i>
            </div>
        </div>

        <h1 class="h4 fw-bold text-dark mb-1">Pesanan Berhasil Dibuat!</h1>
        <p class="text-muted small mb-3">Pesanan Anda langsung diteruskan ke dapur tanpa perlu login.</p>

        <!-- Monitoring Status Pesanan -->
        <div class="bg-light p-3 rounded-4 mb-4 border text-start">
            <div class="small fw-bold text-secondary mb-2"><i class="bi bi-activity text-danger me-1"></i> STATUS MONITORING PESANAN</div>
            <div class="d-flex justify-content-between gap-1 text-center">
                <span class="step-badge active"><i class="bi bi-clock-history me-1"></i> Menunggu</span>
                <span class="step-badge active"><i class="bi bi-fire me-1"></i> Diproses</span>
                <span class="step-badge"><i class="bi bi-bag-check me-1"></i> Siap Diantar</span>
            </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 text-start mb-4 overflow-hidden">
            <div class="p-3 text-white d-flex justify-content-between align-items-center" style="background-color: var(--gacoan-dark);">
                <div>
                    <small class="text-white-50 d-block" style="font-size: 0.7rem;">ID PESANAN</small>
                    <span class="fw-bold fs-6">#GAC-${String(order.id).padStart(5, '0')}</span>
                </div>
                <div class="text-end">
                    <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
                        MEJA #${order.table_number}
                    </span>
                </div>
            </div>
            
            <div class="card-body p-3">
                <div class="row g-2 mb-3 pb-3 border-bottom small">
                    <div class="col-6">
                        <span class="text-muted d-block">Nama Pemesan:</span>
                        <strong class="text-dark">${order.customer_name}</strong>
                    </div>
                    <div class="col-6 text-end">
                        <span class="text-muted d-block">Pembayaran:</span>
                        <strong class="text-uppercase text-danger">${order.payment_method}</strong>
                    </div>
                </div>

                <div class="mb-3">
                    <div class="small fw-bold text-secondary mb-2">RINCIAN MENU</div>
                    ${itemsHtml}
                </div>

                <div class="bg-light p-3 rounded-3 small">
                    <div class="d-flex justify-content-between mb-1 text-secondary">
                        <span>Subtotal</span>
                        <span>Rp ${formatRupiah(rawSubtotal)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-1 text-secondary">
                        <span>Pajak Resto (10% PB1)</span>
                        <span>Rp ${formatRupiah(order.tax_amount)}</span>
                    </div>
                    <hr class="my-2">
                    <div class="d-flex justify-content-between fw-bold text-dark fs-6">
                        <span>Total Akhir</span>
                        <span class="text-danger">Rp ${formatRupiah(order.total_price)}</span>
                    </div>
                </div>
            </div>
        </div>

        <a href="/?table=${order.table_number}" class="btn btn-gacoan w-100 py-3 text-uppercase fw-bold">
            <i class="bi bi-plus-circle me-1"></i> Pesan Menu Tambahan
        </a>
    </div>
</body>
</html>
    `;
}

server.listen(PORT, '127.0.0.1', () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Mie Gacoan Self-Ordering App Server Running!`);
    console.log(`👉 Access URL: http://127.0.0.1:${PORT}?table=14`);
    console.log(`=================================================\n`);
});
