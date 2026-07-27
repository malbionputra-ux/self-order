@extends('layouts.app')

@section('content')
<div class="p-4 text-center">
    <!-- Success Icon Animation -->
    <div class="my-4">
        <div class="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle p-4" style="width: 100px; height: 100px;">
            <i class="bi bi-check-circle-fill display-4" style="color: var(--gacoan-magenta);"></i>
        </div>
    </div>

    <h1 class="h4 fw-bold text-dark mb-1">Pesanan Berhasil Dibuat!</h1>
    <p class="text-muted small mb-4">Pesanan kamu sedang diproses oleh dapur Mie Gacoan.</p>

    <!-- Receipt Card -->
    <div class="card border-0 shadow-sm rounded-4 text-start mb-4 overflow-hidden">
        <div class="bg-gradient p-3 text-white d-flex justify-content-between align-items-center" style="background-color: var(--gacoan-dark);">
            <div>
                <small class="text-white-50 d-block" style="font-size: 0.7rem;">ID PESANAN</small>
                <span class="fw-bold fs-6">#GAC-{{ str_pad($order->id, 5, '0', STR_PAD_LEFT) }}</span>
            </div>
            <div class="text-end">
                <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
                    MEJA #{{ $order->table_number }}
                </span>
            </div>
        </div>
        
        <div class="card-body p-3">
            <div class="row g-2 mb-3 pb-3 border-bottom small">
                <div class="col-6">
                    <span class="text-muted d-block">Nama Pemesan:</span>
                    <strong class="text-dark">{{ $order->customer_name }}</strong>
                </div>
                <div class="col-6 text-end">
                    <span class="text-muted d-block">Pembayaran:</span>
                    <strong class="text-uppercase text-danger">{{ $order->payment_method }}</strong>
                </div>
            </div>

            <!-- Item list -->
            <div class="mb-3">
                <div class="small fw-bold text-secondary mb-2">RINCIAN MENU</div>
                @foreach($order->items as $item)
                    <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light">
                        <div>
                            <div class="fw-bold small text-dark">{{ $item->menu->name ?? 'Menu' }} x {{ $item->quantity }}</div>
                            <div class="text-muted" style="font-size: 0.73rem;">
                                @if($item->spiciness_level)
                                    <span class="badge bg-danger me-1">{{ $item->spiciness_level }}</span>
                                @endif
                                @if($item->notes)
                                    <i>({{ $item->notes }})</i>
                                @endif
                            </div>
                        </div>
                        <div class="fw-bold small text-dark">
                            Rp {{ number_format($item->subtotal, 0, ',', '.') }}
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- Totals -->
            <div class="bg-light p-3 rounded-3 small">
                <div class="d-flex justify-content-between mb-1 text-secondary">
                    <span>Subtotal</span>
                    <span>Rp {{ number_format($order->total_price - $order->tax_amount, 0, ',', '.') }}</span>
                </div>
                <div class="d-flex justify-content-between mb-1 text-secondary">
                    <span>Pajak Resto (10% PB1)</span>
                    <span>Rp {{ number_format($order->tax_amount, 0, ',', '.') }}</span>
                </div>
                <hr class="my-2">
                <div class="d-flex justify-content-between fw-bold text-dark fs-6">
                    <span>Total Akhir</span>
                    <span class="text-danger">Rp {{ number_format($order->total_price, 0, ',', '.') }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Actions -->
    <a href="{{ route('order.index', ['table' => $order->table_number]) }}" class="btn btn-gacoan w-100 py-3 text-uppercase fw-bold">
        <i class="bi bi-plus-circle me-1"></i> Pesan Menu Tambahan
    </a>
</div>
@endsection
