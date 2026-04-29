# Panduan Kolaborasi — SIMPATIK

> Dokumen ini berisi aturan kolaborasi, konvensi commit, branching strategy, dan workflow pengembangan yang **wajib diikuti** oleh seluruh kontributor.

---

## 📂 Branching Strategy

Kami menggunakan **3 branch utama**:

```
production ← staging ← dev ← feature/*
```

| Branch | Fungsi | Deploy ke |
|--------|--------|-----------|
| `dev` | Development aktif, semua fitur baru masuk ke sini | Local |
| `staging` | Testing & QA sebelum production | Server Staging |
| `production` | Versi live yang digunakan Bank | Server Production |

### Aturan Branch

1. **Jangan pernah push langsung ke `production` atau `staging`.**
2. Semua pengembangan fitur dilakukan di branch `feature/*` yang dibuat dari `dev`.
3. Merge ke `staging` hanya jika fitur sudah di-test di `dev`.
4. Merge ke `production` hanya setelah QA dan approval di `staging`.

### Membuat Feature Branch

```bash
# Pastikan di branch dev terbaru
git checkout dev
git pull origin dev

# Buat branch fitur baru
git checkout -b feature/nama-fitur

# Contoh:
git checkout -b feature/inbound-transaction
git checkout -b feature/approval-workflow
git checkout -b fix/stock-calculation-bug
```

### Tipe Branch

| Prefix | Kegunaan | Contoh |
|--------|----------|--------|
| `feature/` | Fitur baru | `feature/outbound-approval` |
| `fix/` | Perbaikan bug | `fix/stock-minus-issue` |
| `hotfix/` | Perbaikan urgent di production | `hotfix/login-error` |
| `chore/` | Maintenance, refactor, docs | `chore/update-readme` |

---

## 📝 Konvensi Commit Message

Gunakan format **Conventional Commits**:

```
<type>(<scope>): <deskripsi singkat>

[body — opsional, penjelasan detail]
```

### Type yang Digunakan

| Type | Kapan Digunakan | Contoh |
|------|-----------------|--------|
| `feat` | Menambah fitur baru | `feat(inbound): tambah form penerimaan barang` |
| `fix` | Memperbaiki bug | `fix(stock): perbaiki kalkulasi saldo akhir` |
| `docs` | Perubahan dokumentasi saja | `docs: update README dengan instruksi instalasi` |
| `style` | Formatting, tanpa perubahan logika | `style: rapikan indentasi di UserResource` |
| `refactor` | Ubah kode tanpa ubah behavior | `refactor(models): pindahkan relasi ke trait` |
| `test` | Tambah atau perbaiki test | `test(outbound): tambah unit test approval` |
| `chore` | Build, config, dependencies | `chore: update filament ke v5.4.0` |
| `perf` | Optimasi performa | `perf(ledger): index kolom item_id` |

### Aturan Commit

1. **Tulis dalam Bahasa Indonesia atau Inggris** — konsisten dalam satu commit.
2. **Huruf kecil semua** pada type dan scope.
3. **Deskripsi singkat** — maksimal 72 karakter.
4. **Satu commit = satu perubahan logis.** Jangan campur fitur dan bugfix dalam 1 commit.
5. **Jangan commit file `.env`** — sudah masuk `.gitignore`.

### Contoh Commit yang Baik ✅

```
feat(outbound): implementasi form pengajuan barang dengan repeater
fix(auth): redirect ke onboarding jika signature belum ada
docs: tambah panduan instalasi di README
chore: install spatie/laravel-permission v7.2
refactor(models): tambah scope per-divisi di OutboundTransaction
```

### Contoh Commit yang Buruk ❌

```
update file                          ← tidak jelas
fix bug                              ← bug apa?
perubahan banyak hal                 ← terlalu umum
FEAT: TAMBAH FITUR BARU!!           ← jangan capslock
```

---

## 🔄 Workflow Pull Request (PR)

### Alur Merge

```
feature/* → dev → staging → production
```

### Aturan PR

1. **Judul PR** mengikuti format commit: `feat(scope): deskripsi`
2. **Deskripsi PR** harus berisi:
   - Apa yang berubah
   - Screenshot (jika ada perubahan UI)
   - Cara testing
3. **Minimal 1 review** sebelum merge ke `dev`.
4. **Minimal 2 review** sebelum merge ke `staging` dan `production`.
5. **Gunakan Squash & Merge** saat merge ke `dev` agar history bersih.
6. **Hapus branch** setelah merge.

---

## 🏗️ Struktur Kode

### Penamaan File & Class

| Komponen | Konvensi | Contoh |
|----------|----------|--------|
| Model | PascalCase, Singular | `Item.php`, `OutboundTransaction.php` |
| Migration | snake_case, deskriptif | `create_outbound_transactions_table` |
| Resource (Filament) | PascalCase + Resource | `ItemResource.php` |
| Seeder | PascalCase + Seeder | `RolePermissionSeeder.php` |
| Controller | PascalCase + Controller | `ForecastController.php` |
| Middleware | PascalCase | `EnsureSignatureCompleted.php` |

### Struktur Folder Utama

```
app/
├── Filament/
│   └── Resources/        # Filament CRUD Resources
├── Http/
│   ├── Controllers/      # API Controllers (untuk ML microservice)
│   └── Middleware/        # Custom middleware (signature check, dll)
├── Models/               # Eloquent Models
├── Policies/             # Authorization Policies
└── Providers/            # Service Providers

database/
├── migrations/           # Schema migrations
├── seeders/              # Data seeders (roles, permissions, settings)
└── factories/            # Model factories untuk testing

resources/
└── views/
    └── pdf/              # Template Blade untuk generate PDF BAST/SPB
```

---

## ⚠️ Hal yang Harus Diperhatikan

### Jangan Pernah

- ❌ Push langsung ke `production` atau `staging`
- ❌ Commit file `.env` (berisi credentials)
- ❌ Commit folder `vendor/` atau `node_modules/`
- ❌ Hardcode credentials di source code
- ❌ Mengubah migration yang sudah di-merge ke `staging`/`production`

### Selalu

- ✅ Pull terbaru sebelum mulai kerja: `git pull origin dev`
- ✅ Jalankan `php artisan migrate` setelah pull
- ✅ Test fitur secara lokal sebelum push
- ✅ Tulis commit message yang jelas dan deskriptif
- ✅ Review kode sendiri sebelum buat PR

---

## 🔧 Setup Development Environment

```bash
# Clone & install
git clone https://github.com/wahyu2021/SIMPATIK.git
cd SIMPATIK
composer install
npm install
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate --seed

# Jalankan development server
php artisan serve
# atau
composer run dev
```

---

## 📞 Kontak

Jika ada pertanyaan terkait development, hubungi:
- **Repository**: [github.com/wahyu2021/SIMPATIK](https://github.com/wahyu2021/SIMPATIK)
