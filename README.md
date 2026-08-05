# ☕ Coffee & Eatery - QR Code Web Self-Ordering (React + Vite + TailwindCSS)

Aplikasi **Web Self-Ordering QR Code Meja** modern untuk **Coffee & Eatery** dibangun dengan **React, Vite, TailwindCSS (v4), Framer Motion, dan Lucide React Icons**.

## 📱 Arsitektur & Fitur Utama

1. **Halaman 1 (Landing Grid Kategori)**:
   - Header Frosted Dark Mocha dengan logo Coffee & link Instagram.
   - Badge Meja Dinamis dengan modal edit nomor meja.
   - Hero Banner bertema *Warm Space & Good Mood*.
   - **4 Grid Card Kategori** (*Signature Coffee*, *Non-Coffee & Refreshers*, *Artisan Pastry*, *Eatery & Mains*) dengan animasi muncul bertahap (*staggered entrance*).

2. **Halaman 2 (Daftar Menu 2-Kolom)**:
   - Terbuka dengan transisi geser mulus (*Framer Motion slide animation*).
   - Tombol **`← Kembali Ke Kategori`** sticky bar.
   - Grid 2-kolom kartu produk besar dengan foto resolusi tinggi HD, deskripsi, harga, dan badge Favorite.

3. **Product Detail Modal (Kustomisasi Kontekstual & Dynamic Photo)**:
   - Starbucks-style Rich Modal dengan animasi *spring physics*.
   - **Foto Berubah Otomatis**: Foto berganti saat memilih varian `Ice` vs `Hot`.
   - **Pill Kontekstual**: Drink hangat (*Kopi Kedua*) HANYA menampilkan `Hot (Hangat)`, drink dingin (*Caramon Mocktail*) HANYA menampilkan level es.
   - Pilihan Tingkat Manis, Susu (Fresh/Oat/Almond), Catatan Khusus, dan Counter Porsi (`- 1 +`).

4. **Floating Cart & Checkout Bottom Sheet**:
   - Bar keranjang melayang dengan animasi membal gembira (*cart bounce*).
   - Bottom Sheet Checkout dengan pilihan pembayaran (QRIS / Kasir), perhitungan pajak PB1 Resto 10%, dan layar struk sukses monitoring barista.

## 🚀 Cara Menjalankan Aplikasi (Vite React Dev Server)

```bash
# Install dependencies
npm install

# Jalankan Vite Dev Server
npm run dev
```
