# Track: Refactor Services to DTO (Data Transfer Object)

## Metadata
- **Track ID**: `refactor-services-to-dto`
- **Status**: ✅ Completed
- **Prioritas**: Tinggi
- **Deskripsi**: Mengganti penggunaan tipe data primitif atau struktur `array` mentah di dalam *Service Layer* menjadi objek yang terdefinisi dengan jelas menggunakan *Data Transfer Object* (DTO). Hal ini untuk meningkatkan *type-safety*, *auto-completion* di IDE, dan kejelasan kontrak data antar lapisan (Controller -> Service).

---

## Latar Belakang Masalah
Saat ini, semua metode `create` dan `update` di *Service Layer* menerima parameter berupa `array $data`. Sebagai contoh:
```php
public function createUser(array $data): User
```
Walaupun cepat ditulis, pendekatan ini memiliki kelemahan:
1. **Tidak Ada Prediktabilitas**: *Developer* tidak bisa melihat secara langsung *key* apa saja yang wajib dan opsional dari `$data` tanpa membuka *Form Request* atau file asal datanya.
2. **Tidak Ada Type-Safety**: Kita tidak bisa menjamin bahwa `$data['quantity']` adalah *integer*.
3. **Rawan Typo**: Pemanggilan `$data['first_name']` bisa menyebabkan error mematikan jika sebenarnya *key* yang dikirimkan adalah `$data['name']`.

## Target Implementasi

Berikut adalah daftar *Service* yang akan dibongkar untuk menggunakan DTO beserta nama DTO yang perlu diciptakan:

### 1. Kategori & Departemen (Master Data Basic)
- [x] Buat `App\DTOs\Category\CategoryDTO`
  - *Fields*: `string $name`
- [x] Refactor `CategoryService::createCategory` dan `CategoryService::updateCategory`.
- [x] Buat `App\DTOs\Department\DepartmentDTO`
  - *Fields*: `string $name`
- [x] Refactor `DepartmentService::createDepartment` dan `DepartmentService::updateDepartment`.

### 2. User & Item (Master Data Kompleks)
- [x] Pindahkan/buat ulang `App\DTOs\User\UserDTO` (untuk Create dan Update)
  - *Fields*: `string $name`, `string $email`, `?string $password`, `int $department_id`, `string $role`, `bool $is_active`
- [x] Refactor `UserService::createUser` dan `UserService::updateUser`.
- [x] Buat `App\DTOs\Item\ItemDTO`
  - *Fields*: `string $name`, `string $item_code`, `int $category_id`, `string $unit_of_measure`, `float $unit_price`, `int $current_stock`, `int $minimum_stock`, `string $notes`
- [x] Refactor `ItemService::createItem` dan `ItemService::updateItem`.

### 3. Inbound & Outbound (Transaksi)
- [x] Buat `App\DTOs\Transaction\InboundDTO`
  - *Fields*: `string $reference_number`, `int $user_id`, `string $transaction_date`, `array $details`, `?string $notes`
- [x] Refactor `InboundService::createInbound`.
- [x] Buat `App\DTOs\Transaction\OutboundDTO` (untuk Form Request Biasa)
  - *Fields*: `int $requester_id`, `int $department_id`, `string $transaction_date`, `bool $is_special_request`, `array $details`, `?string $notes`
- [x] Refactor `OutboundService::createRequest`, `OutboundService::createDirectRequest`, dan `OutboundService::updateRequest`.

### 4. Laporan Rekonsiliasi
- [x] Buat `App\DTOs\Report\ReconciliationDTO`
  - *Fields*: `int $month`, `int $year`, `int $user_id`, `array $details`, `?string $notes`
- [x] Refactor `ReportService::saveReconciliation`.

### 5. Profil Pengguna
- [x] Buat `App\DTOs\Profile\ProfileDTO`
  - *Fields*: `string $name`, `string $email`
- [x] Refactor `ProfileService::updateProfile`.

---

## Langkah-langkah / SOP Eksekusi per Service:

1. **Buat file class DTO** menggunakan fitur *Constructor Property Promotion* dari PHP 8 untuk kode yang lebih ringkas. Pastikan semua *property* di-*set* `readonly`.
   *Contoh:*
   ```php
   class CategoryDTO {
       public function __construct(
           public readonly string $name
       ) {}
   }
   ```
2. **Tambahkan method `fromRequest`** di dalam *Form Request* atau buat *factory method* di DTO (misal: `CategoryDTO::fromArray(array $data)`) untuk mengubah *array validation* menjadi DTO dengan mudah.
3. **Ubah parameter (Signature) Service** dari `array $data` menjadi `CategoryDTO $dto`.
4. **Update pemanggilan di Controller**, dari `$this->service->create($request->validated())` menjadi `$this->service->create(CategoryDTO::fromRequest($request))`.
5. Uji API/Formulir di tampilan web untuk memastikan tidak ada fitur yang *break* (rusak).

---

## Catatan Penting
- Karena `details` pada transaksi (*Inbound*, *Outbound*, *Reconciliation*) juga merupakan *array of arrays*, sangat direkomendasikan untuk membuat *Nested DTO* (contoh: *array* dari `InboundDetailDTO`), namun jika ingin pragmatis, *array* validasi yang ketat tetap bisa ditolerir untuk tingkat *detail* agar struktur tidak terlalu kaku. Fokuskan DTO pada *Header Level* terlebih dahulu.
