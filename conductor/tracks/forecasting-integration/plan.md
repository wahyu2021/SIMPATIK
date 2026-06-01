# Implementation Plan: Integrasi ML Forecasting (XGBoost)

Menghubungkan aplikasi Laravel SIMPATIK dengan microservice Python (FastAPI) untuk memprediksi kebutuhan stok ATK bulanan.

## Goals
- Otomatisasi pengiriman data historis mutasi stok ke API ML.
- Menampilkan hasil prediksi permintaan (Demand) dan saran jumlah pesanan (Suggested Order) di dashboard.
- Menyediakan metrik evaluasi model (MAE Score) untuk transparansi akurasi.

## Task List
- [ ] **Data Preparation (Backend)**:
    - [ ] Buat logic di `ReportService` untuk mengekspor data mutasi bulanan ke format JSON yang sesuai dengan input model XGBoost.
- [ ] **API Integration**:
    - [ ] Konfigurasi `ML_API_URL` di `settings` dan `.env`.
    - [ ] Implementasi `PredictionService` di Laravel untuk memanggil endpoint FastAPI.
- [ ] **Storage Logic**:
    - [ ] Implementasi logic untuk menyimpan hasil API ke tabel `demand_forecasts`.
- [ ] **Frontend Integration**:
    - [ ] Buat dashboard/widget "Smart Forecasting" di halaman Reports atau Dashboard.
    - [ ] Tampilkan perbandingan: Prediksi vs Stok Saat Ini -> Saran Pesanan.

## Definition of Done
- Admin dapat menekan tombol "Generate Forecast" dan mendapatkan angka prediksi kebutuhan barang untuk bulan berikutnya berdasarkan data historis.
