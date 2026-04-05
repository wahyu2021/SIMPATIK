# Setup Laravel + Inertia.js + React TypeScript

## 🎯 Migrasi dari Filament ke Inertia React

Project SIMPATIK telah dimigrasikan dari **Filament PHP** ke **Laravel + Inertia.js + React TypeScript**.

## 📦 Packages Terinstall

### Backend (Composer)
- `inertiajs/inertia-laravel` ^3.0 - Server-side adapter
- `tightenco/ziggy` ^2.6 - Laravel routes untuk TypeScript
- `spatie/laravel-permission` ^7.2 - Role & permission management
- `barryvdh/laravel-dompdf` ^3.1 - PDF generator
- `simplesoftwareio/simple-qrcode` ^4.2 - QR Code generator

### Frontend (NPM)
- `react` ^19.2 - React framework
- `react-dom` ^19.2 - React DOM renderer
- `@inertiajs/react` ^3.0 - Inertia React adapter
- `typescript` ^6.0 - TypeScript compiler
- `@vitejs/plugin-react` ^5.2 - Vite plugin untuk React
- `tailwindcss` ^4.0 - CSS framework

## 🚀 Development Commands

### Start development server
```bash
composer dev
# atau manual:
php artisan serve
npm run dev
```

### Build untuk production
```bash
npm run build
```

### Generate Ziggy routes
```bash
php artisan ziggy:generate
```

## 📁 Struktur Folder

```
resources/
├── js/
│   ├── app.tsx                 # Entry point Inertia
│   ├── bootstrap.js            # Axios setup
│   ├── Pages/                  # React components untuk halaman
│   │   └── Welcome.tsx         # Halaman welcome
│   └── types/                  # TypeScript type definitions
│       └── index.d.ts          # Global types
├── views/
│   └── app.blade.php           # Root template Inertia
└── css/
    └── app.css                 # Tailwind CSS
```

## 🔧 Konfigurasi Utama

### 1. Inertia Middleware
`app/Http/Middleware/HandleInertiaRequests.php` - Mengatur shared data ke semua komponen React.

### 2. Vite Config
`vite.config.js` - Konfigurasi React plugin, Tailwind, dan path alias `@/*`.

### 3. TypeScript Config
- `tsconfig.json` - Konfigurasi TypeScript untuk React
- `tsconfig.node.json` - Konfigurasi untuk Vite config

### 4. Routes
`routes/web.php` - Menggunakan `Inertia::render()` untuk merender komponen React.

## 📝 Cara Membuat Halaman Baru

### 1. Buat React Component
```tsx
// resources/js/Pages/Dashboard.tsx
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div>
                <h1>Welcome, {auth.user?.name}</h1>
            </div>
        </>
    );
}
```

### 2. Tambahkan Route
```php
// routes/web.php
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware('auth');
```

## 🎨 Styling dengan Tailwind CSS

Tailwind CSS 4.x sudah terkonfigurasi otomatis melalui Vite plugin. Gunakan utility classes langsung di JSX:

```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    Click me
</button>
```

## 🔐 Authentication

Shared data `auth.user` tersedia di semua komponen melalui props:

```tsx
import { PageProps } from '@/types';

export default function MyPage({ auth }: PageProps) {
    const user = auth.user;
    
    if (!user) {
        return <div>Please login</div>;
    }
    
    return <div>Hello {user.name}</div>;
}
```

## 🛠️ TypeScript Types

Tambahkan custom types di `resources/js/types/index.d.ts`:

```typescript
export interface User {
    id: number;
    name: string;
    email: string;
    // tambahkan field lainnya
}
```

## 📚 Dokumentasi Referensi

- [Inertia.js](https://inertiajs.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Ziggy](https://github.com/tighten/ziggy)
