@extends('layouts.app')

@section('styles')
<style>
    .header-bar {
        background: linear-gradient(135deg, #E60067 0%, #B80052 100%);
        color: white;
        padding: 16px 20px;
        position: sticky;
        top: 0;
        z-index: 1020;
        box-shadow: 0 4px 12px rgba(230, 0, 103, 0.25);
    }
    
    .table-badge {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        font-weight: 700;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .table-badge:hover {
        background: rgba(255, 255, 255, 0.35);
    }

    .category-pills {
        display: flex;
        overflow-x: auto;
        gap: 8px;
        padding: 12px 16px;
        background: #FFFFFF;
        position: sticky;
        top: 65px;
        z-index: 1010;
        border-bottom: 1px solid #F0F0F0;
        scrollbar-width: none;
    }
    .category-pills::-webkit-scrollbar {
        display: none;
    }

    .cat-btn {
        white-space: nowrap;
        padding: 8px 18px;
        border-radius: 25px;
        font-size: 0.85rem;
        font-weight: 700;
        border: 1.5px solid #E0E0E0;
        color: #555555;
        background: #F8F9FA;
        transition: all 0.2s ease;
    }
    .cat-btn.active {
        background-color: var(--gacoan-magenta);
        color: #FFFFFF;
        border-color: var(--gacoan-magenta);
        box-shadow: 0 3px 8px rgba(230, 0, 103, 0.3);
    }

    .menu-card {
        border: none;
        border-radius: 16px;
        background: #FFFFFF;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        padding: 12px;
        margin-bottom: 14px;
        display: flex;
        gap: 12px;
        align-items: center;
    }
    .menu-img {
        width: 90px;
        height: 90px;
        object-fit: cover;
        border-radius: 12px;
        flex-shrink: 0;
    }
    .menu-info {
        flex: 1;
        min-width: 0;
    }
    .menu-title {
        font-weight: 800;
        font-size: 0.98rem;
        margin-bottom: 4px;
        color: var(--gacoan-dark);
    }
    .menu-desc {
        font-size: 0.78rem;
        color: #777;
        margin-bottom: 8px;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .menu-price {
        font-weight: 800;
        color: var(--gacoan-magenta);
        font-size: 0.95rem;
    }

    /* Floating Cart Bar */
    .cart-bar {
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 448px;
        background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
        color: white;
        border-radius: 18px;
        padding: 14px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        z-index: 1040;
        cursor: pointer;
        transition: transform 0.25s ease, opacity 0.25s ease;
    }
    .cart-bar.hidden {
        transform: translate(-50%, 120px);
        opacity: 0;
        pointer-events: none;
    }

    /* Spicy Level Radio Pill Buttons */
    .spicy-selector {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
    }
    .spicy-option input[type="radio"] {
        display: none;
    }
    .spicy-option label {
        display: block;
        text-align: center;
        padding: 10px 4px;
        border: 2px solid #E0E0E0;
        border-radius: 12px;
        font-weight: 700;
        font-size: 0.85rem;
        color: #444;
        cursor: pointer;
        transition: all 0.2s;
    }
    .spicy-option input[type="radio"]:checked + label {
        border-color: var(--gacoan-magenta);
        background-color: var(--gacoan-magenta-light);
        color: var(--gacoan-magenta);
    }
</style>
@endsection

@section('content')
<!-- Header Bar -->
<div class="header-bar d-flex justify-content-between align-items-center">
    <div class="d-flex align-items-center gap-2">
        <i class="bi bi-fire fs-3 text-warning"></i>
        <div>
            <h1 class="h6 mb-0 fw-bold text-white">MIE GACOAN</h1>
            <small class="text-white-50" style="font-size: 0.72rem;">Self-Ordering App (Tanpa Login)</small>
        </div>
    </div>
    <div class="table-badge d-flex align-items-center gap-1" onclick="promptTableNumber()">
        <i class="bi bi-qr-code-scan"></i> Meja #<span id="displayTableNumber">{{ $tableNumber }}</span>
        <i class="bi bi-pencil-square ms-1" style="font-size: 0.75rem;"></i>
    </div>
</div>

<!-- Modal Input Nomor Meja (Pop-up Awal jika belum ada Meja) -->
<div class="modal fade" id="tablePromptModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered px-3">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
            <div class="modal-body text-center p-4">
                <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3" style="width: 70px; height: 70px;">
                    <i class="bi bi-geo-alt-fill fs-2" style="color: var(--gacoan-magenta);"></i>
                </div>
                <h5 class="fw-bold text-dark mb-1">Selamat Datang di Mie Gacoan!</h5>
                <p class="text-muted small mb-4">Masukkan nomor meja tempat Anda duduk untuk mulai memesan langsung tanpa perlu login.</p>

                <div class="mb-3">
                    <label class="form-label fw-bold text-secondary small">NOMOR MEJA DUDUK</label>
                    <input type="number" id="inputTableNumber" class="form-control form-control-lg text-center fw-bold fs-4" placeholder="Cth: 14" min="1" max="99" value="{{ $tableNumber }}">
                </div>

                <button type="button" class="btn btn-gacoan w-100 py-3 text-uppercase fw-bold" onclick="saveTableNumber()">
                    Mulai Pilih Menu <i class="bi bi-arrow-right-short fs-5"></i>
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Category Pills Navigation -->
<div class="category-pills" id="categoryTabs">
    <button class="cat-btn active" data-category="all" onclick="filterCategory('all', this)">Semua Menu</button>
    @foreach($categories as $category)
        <button class="cat-btn" data-category="{{ $category->slug }}" onclick="filterCategory('{{ $category->slug }}', this)">
            {{ $category->name }}
        </button>
    @endforeach
</div>

<!-- Menu Items Container -->
<div class="p-3">
    @foreach($categories as $category)
        <div class="category-section mb-4" id="cat-section-{{ $category->slug }}">
            <h2 class="h6 fw-bold mb-3 text-secondary d-flex align-items-center gap-2">
                <span class="bg-danger rounded-circle d-inline-block" style="width: 8px; height: 8px;"></span>
                {{ $category->name }} ({{ count($category->menus) }})
            </h2>
            
            @foreach($category->menus as $menu)
                <div class="menu-card" data-category="{{ $category->slug }}">
                    <img src="{{ $menu->image ?? 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200' }}" alt="{{ $menu->name }}" class="menu-img" onerror="this.src='https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200'">
                    <div class="menu-info">
                        <h3 class="menu-title">{{ $menu->name }}</h3>
                        <p class="menu-desc">{{ Str::limit($menu->description, 55) }}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="menu-price">Rp {{ number_format($menu->price, 0, ',', '.') }}</span>
                            @if($menu->has_spicy_levels)
                                <button class="btn btn-gacoan btn-sm px-3 py-1" 
                                    onclick="openSpicyModal({{ json_encode($menu) }})">
                                    + Tambah
                                </button>
                            @else
                                <button class="btn btn-gacoan btn-sm px-3 py-1" 
                                    onclick="addToCartDirect({{ json_encode($menu) }})">
                                    + Tambah
                                </button>
                            @endif
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @endforeach
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
            <div class="fw-bold fs-6" id="cartTotalPrice">Rp 0</div>
        </div>
    </div>
    <div class="d-flex align-items-center gap-1 font-weight-bold text-warning small">
        <span>Lanjut Checkout</span>
        <i class="bi bi-chevron-right fs-6"></i>
    </div>
</div>

<!-- Modal Level Kepedasan -->
<div class="modal fade" id="spicyModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered px-3">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold" id="spicyMenuTitle">Pilih Level Kepedasan</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="spicyMenuId">
                <p class="text-muted small mb-3">Pilih tingkat kepedasan favoritmu untuk menu ini:</p>
                
                <div class="spicy-selector mb-3">
                    @foreach(['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 6', 'Level 8'] as $lvl)
                        <div class="spicy-option">
                            <input type="radio" name="spiciness_level" id="spicy_{{ Str::slug($lvl) }}" value="{{ $lvl }}" {{ $loop->index === 1 ? 'checked' : '' }}>
                            <label for="spicy_{{ Str::slug($lvl) }}">{{ $lvl }}</label>
                        </div>
                    @endforeach
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

<!-- Offcanvas / Modal Checkout -->
<div class="offcanvas offcanvas-bottom h-auto rounded-top-4" tabindex="-1" id="checkoutCanvas" style="max-width: 480px; margin: 0 auto; max-height: 92vh;">
    <div class="offcanvas-header border-bottom py-3">
        <h5 class="offcanvas-title fw-bold"><i class="bi bi-receipt text-danger me-2"></i> Ringkasan Pesanan</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body p-3">
        <form id="orderForm" onsubmit="submitOrder(event)">
            <input type="hidden" id="formTableNumber" name="table_number" value="{{ $tableNumber }}">
            
            <div class="mb-3">
                <label class="form-label fw-bold small text-dark"><i class="bi bi-person-fill text-danger me-1"></i> Nama Pemesan</label>
                <input type="text" name="customer_name" class="form-control" placeholder="Masukkan nama kamu..." required>
            </div>

            <!-- Cart Items List -->
            <div class="mb-3">
                <label class="form-label fw-bold small text-dark"><i class="bi bi-cart3 text-danger me-1"></i> Item Pesanan</label>
                <div id="checkoutItemsList" class="d-flex flex-column gap-2"></div>
            </div>

            <!-- Payment Method & Upload Bukti Pembayaran -->
            <div class="mb-3">
                <label class="form-label fw-bold small text-dark"><i class="bi bi-wallet2 text-danger me-1"></i> Metode Pembayaran</label>
                <div class="d-flex gap-2 mb-2">
                    <input type="radio" class="btn-check" name="payment_method" id="pay_qris" value="qris" checked onchange="toggleProofUpload(this.value)">
                    <label class="btn btn-outline-gacoan flex-fill py-2 text-center" for="pay_qris">
                        <i class="bi bi-qr-code"></i> QRIS / Transfer
                    </label>

                    <input type="radio" class="btn-check" name="payment_method" id="pay_kasir" value="kasir" onchange="toggleProofUpload(this.value)">
                    <label class="btn btn-outline-gacoan flex-fill py-2 text-center" for="pay_kasir">
                        <i class="bi bi-cash-stack"></i> Bayar di Kasir
                    </label>
                </div>

                <!-- Proof of Payment Upload Container -->
                <div id="proofUploadContainer" class="bg-light p-3 rounded-3 border mb-2">
                    <label class="form-label fw-bold small text-dark mb-1"><i class="bi bi-upload text-danger me-1"></i> Unggah Bukti Pembayaran (Opsional)</label>
                    <input type="file" name="payment_proof" class="form-control form-control-sm" accept="image/*">
                    <small class="text-muted" style="font-size: 0.7rem;">Anda dapat mengunggah struk transfer/QRIS sekarang atau setelah memesan.</small>
                </div>
            </div>

            <!-- Pricing Calculation Breakdown -->
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
@endsection

@section('scripts')
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

        // Check if table number exists in URL or LocalStorage
        const urlParams = new URLSearchParams(window.location.search);
        let table = urlParams.get('table');

        if (!table) {
            table = localStorage.getItem('gacoan_table_number');
        }

        if (!table || table === '') {
            tablePromptBsModal.show();
        } else {
            setTableNumber(table);
        }
    });

    function promptTableNumber() {
        tablePromptBsModal.show();
    }

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

        const sections = document.querySelectorAll('.category-section');
        sections.forEach(sec => {
            if (slug === 'all' || sec.id === 'cat-section-' + slug) {
                sec.style.display = 'block';
            } else {
                sec.style.display = 'none';
            }
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
        const existingIndex = cart.findIndex(item => 
            item.menu_id === menu.id && 
            item.spiciness_level === spicinessLevel && 
            item.notes === notes
        );

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
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
        renderCheckoutItems();
    }

    function updateCartUI() {
        const cartBar = document.getElementById('cartBar');
        const cartTotalCount = document.getElementById('cartTotalCount');
        const cartTotalPrice = document.getElementById('cartTotalPrice');

        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (totalItems > 0) {
            cartBar.classList.remove('hidden');
            cartTotalCount.innerText = totalItems;
            cartTotalPrice.innerText = 'Rp ' + formatRupiah(subtotal);
        } else {
            cartBar.classList.add('hidden');
        }
    }

    function openCheckoutModal() {
        renderCheckoutItems();
        checkoutBsCanvas.show();
    }

    function toggleProofUpload(method) {
        const container = document.getElementById('proofUploadContainer');
        if (method === 'qris') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
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
            div.innerHTML = `
                <div>
                    <div class="fw-bold small text-dark">${item.name}</div>
                    <div class="text-muted" style="font-size: 0.72rem;">
                        ${item.spiciness_level ? '<span class="badge bg-danger me-1">' + item.spiciness_level + '</span>' : ''}
                        ${item.notes ? '<i>(' + item.notes + ')</i>' : ''}
                    </div>
                    <div class="text-danger fw-bold small">Rp ${formatRupiah(item.price)}</div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-outline-secondary btn-sm px-2 py-0" onclick="updateCartQuantity(${index}, -1)">-</button>
                    <span class="fw-bold small px-1">${item.quantity}</span>
                    <button type="button" class="btn btn-outline-danger btn-sm px-2 py-0" onclick="updateCartQuantity(${index}, 1)">+</button>
                </div>
            `;
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
        if (cart.length === 0) {
            alert('Silakan pilih minimal 1 menu pesanan.');
            return;
        }

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
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirect_url;
            } else {
                alert('Gagal membuat pesanan. Silakan coba lagi.');
            }
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan jaringan.');
        }
    }
</script>
@endsection
