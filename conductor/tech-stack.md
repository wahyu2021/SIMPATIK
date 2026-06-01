# Tech Stack: SIMPATIK (Aktual)

## Backend (Laravel 12)
- **Architecture**: **Layered Repository Pattern**.
  - **Models**: Eloquent models dengan SoftDeletes dan custom Casts.
  - **Repositories**: Interface di `app/Repositories/Contracts`, implementasi di `app/Repositories/Eloquent`.
  - **Services**: Business logic di `app/Services`, mengonsumsi Repository.
  - **Controllers**: Thin controllers di `app/Http/Controllers`, mengonsumsi Service dan merender Inertia Response.
  - **Requests**: Validasi input via Form Requests di `app/Http/Requests`.
- **Database**: MySQL 8.x.
- **Packages Utama**:
  - `inertiajs/inertia-laravel`: Jembatan ke React.
  - `spatie/laravel-permission`: Manajemen Role & Permission.
  - `barryvdh/laravel-dompdf`: Export PDF.
  - `simplesoftwareio/simple-qrcode`: Validasi dokumen via QR.

## Frontend (React + TypeScript)
- **Framework**: React 18/19 via Vite.
- **UI Bridge**: Inertia.js (SPA feel tanpa API REST tradisional).
- **Design Pattern**: **Modified Atomic Design**.
  - **`resources/js/Components/UI`**: Komponen dasar (Atoms/Molecules) seperti Button, Input, Modal, DataTable.
  - **`resources/js/Components/Fragments`**: Komponen menengah (CardLink, ListItem).
  - **`resources/js/Components/Features`**: Komponen spesifik fitur/modul (misal: `Features/Outbound/ApprovalCard`).
  - **`resources/js/Layouts`**: Layout utama aplikasi (AuthenticatedLayout).
  - **`resources/js/Pages`**: Komponen halaman utama yang dipanggil router.
- **Styling**: Tailwind CSS 4.x.
- **State & Hooks**: Inertia `useForm`, custom hooks (`useDebounce`, dll).

## Microservice ML
- **Stack**: FastAPI (Python), XGBoost.
- **Komunikasi**: Laravel bertindak sebagai klien yang memanggil endpoint FastAPI untuk mendapatkan hasil prediksi kebutuhan ATK.
