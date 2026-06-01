# Product Guidelines: SIMPATIK

## Branching Strategy
- **`production`**: Versi live. Jangan push langsung.
- **`staging`**: Testing & QA.
- **`dev`**: Development aktif. Semua fitur baru digabungkan di sini.
- **`feature/*`**: Branch per fitur (dibuat dari `dev`).
- **`fix/*`**: Perbaikan bug.

## Aturan Git & Commit (Conventional Commits)
Gunakan format: `<type>(<scope>): <deskripsi singkat>`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`.
- Gunakan bahasa Indonesia/Inggris (konsisten per commit), huruf kecil untuk type/scope.
- Jangan campur fitur dan bugfix dalam 1 commit.
- PR harus ke branch `dev` (minimal 1 review), Squash & Merge disarankan.

## Arsitektur dan Konvensi Koding
### Backend (Laravel)
- Terapkan **Repository Pattern**.
  - **Controllers**: Hanya untuk routing, form request validation, no business logic. (PascalCase + Controller).
  - **Services**: Tempat business logic berada. (PascalCase + Service).
  - **Repositories**: Database queries.
  - **DTOs**: Data Transfer Objects antar layer.
- Penamaan Model: PascalCase (singular).
- Penamaan Migration: snake_case.

### Frontend (Inertia React TypeScript)
- Terapkan variasi **Atomic Design Pattern** dengan struktur: `UI` (Atoms/Molecules, komponen reusable), `Fragments` (Molecules/Organisms kecil), `Features` (Komponen besar spesifik per modul), `Layouts` (Templates), dan `Pages` (Halaman Inertia).
- Pisahkan presentasi dan logika.
- Ekstrak logic yang dapat di-reuse ke **Hooks**.
- Penamaan Component/Page/Type: PascalCase.
- Penamaan Hooks: camelCase dengan awalan `use`.
- Import aliases dengan awalan `@/`.

## Aturan Setup Lokal
1. `composer install` & `npm install`.
2. Salin `.env.example` ke `.env`, generate key.
3. Link storage: `php artisan storage:link`.
4. Jalankan `php artisan migrate --seed`.
5. Run server: `composer run dev` (atau `php artisan serve` & `npm run dev`).
