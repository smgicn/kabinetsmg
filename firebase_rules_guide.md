# Firebase Configuration Guide - Project: kabinnet12-d8305

## 1. Project Details
- **Project ID**: `kabinnet12-d8305`
- **Auth Domain**: `kabinnet12-d8305.firebaseapp.com`
- **Storage Bucket**: `kabinnet12-d8305.firebasestorage.app`
- **Main Client File**: `index_firebase.html`

---

## 2. Real-time Firebase Features Active in `index_firebase.html`
1. **Firestore Real-time Database**:
   - `syncToServer()` menyimpan dan menyinkronkan data **Konten**, **Klasifikasi**, **Harga Layanan**, **Lampiran**, dan **Materi** secara otomatis ke project `kabinnet12-d8305`.
   - `onSnapshot` mendengarkan perubahan data secara real-time dari Firestore sehingga seluruh user melihat update tanpa perlu refresh.

2. **Perubahan Fitur Terbaru di App**:
   - **Search Instant**: Debounce animation frame tanpa delay + tombol bersihkan (✕).
   - **Urutan Card Dual-Sort**: Berlaku (A-Z) ➔ Tidak Berlaku (A-Z). Pinned paling atas.
   - **Reorder Klasifikasi Admin**: Tombol `▲`/`▼` dan `🔄 Balik Urutan`.
   - **Kategori Materi & Border Card**: Radio pilihan *Semua* (Hitam), *Outbound* (Hijau), *Back Office* (Biru).
   - **Hover Card Lift & Color-Matched Glow**: Bayangan mengambang sesuai warna border card.
   - **Hapus All Harga Layanan**: Hapus massal data harga admin dengan konfirmasi.
   - **Tombol Action Full Warna**: Selengkapnya (Merah), Link 1 (Kuning), Link 2 (Hijau), Link 3 (Biru), Link 4+ (Ungu).

---

## 3. Deployment ke Firebase Hosting (Optional Command)
Untuk mempublikasikan file ke Firebase Hosting project `kabinnet12-d8305`:
```bash
firebase use kabinnet12-d8305
firebase deploy --only hosting
```
