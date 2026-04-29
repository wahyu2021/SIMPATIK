# Struktur Project SIMPATIK - Laravel + Inertia React TypeScript

## 📐 Arsitektur Project

Project ini menggunakan **Repository Pattern** untuk backend dan **Atomic Design Pattern** untuk frontend React.

---

## 🗂️ Backend Structure (Laravel)

### 1. **Layered Architecture**

```
app/
├── Http/
│   ├── Controllers/          # Controllers (thin layer)
│   │   ├── Api/             # API Controllers (jika ada REST API)
│   │   ├── Auth/            # Authentication Controllers
│   │   ├── InventoryController.php
│   │   ├── RequestController.php
│   │   └── ReportController.php
│   │
│   ├── Middleware/
│   │   ├── HandleInertiaRequests.php
│   │   └── CheckRole.php
│   │
│   ├── Requests/            # Form Request Validation
│   │   ├── Auth/
│   │   ├── Inventory/
│   │   │   ├── StoreInventoryRequest.php
│   │   │   └── UpdateInventoryRequest.php
│   │   └── Request/
│   │       └── CreateRequestRequest.php
│   │
│   └── Resources/           # API Resources (untuk transform data)
│       ├── UserResource.php
│       └── InventoryResource.php
│
├── Services/                # Business Logic Layer
│   ├── Auth/
│   │   └── AuthService.php
│   ├── Inventory/
│   │   ├── InventoryService.php
│   │   └── StockService.php
│   ├── Request/
│   │   └── RequestService.php
│   ├── Report/
│   │   └── ReportService.php
│   └── ML/
│       └── PredictionService.php
│
├── Repositories/            # Data Access Layer
│   ├── Contracts/           # Repository Interfaces
│   │   ├── InventoryRepositoryInterface.php
│   │   ├── RequestRepositoryInterface.php
│   │   └── UserRepositoryInterface.php
│   │
│   └── Eloquent/            # Repository Implementations
│       ├── InventoryRepository.php
│       ├── RequestRepository.php
│       └── UserRepository.php
│
├── Models/                  # Eloquent Models
│   ├── User.php
│   ├── Inventory.php
│   ├── Request.php
│   ├── RequestItem.php
│   ├── Approval.php
│   └── AuditLog.php
│
├── Enums/                   # PHP Enums (Laravel 12)
│   ├── RequestStatus.php
│   ├── ApprovalStatus.php
│   └── UserRole.php
│
├── DTOs/                    # Data Transfer Objects
│   ├── Inventory/
│   │   └── CreateInventoryDTO.php
│   └── Request/
│       └── CreateRequestDTO.php
│
├── Actions/                 # Single-purpose actions (optional)
│   ├── Inventory/
│   │   ├── CreateInventoryAction.php
│   │   └── UpdateStockAction.php
│   └── Request/
│       └── ApproveRequestAction.php
│
├── Traits/                  # Reusable traits
│   ├── HasAuditLog.php
│   └── HasSignature.php
│
├── Observers/               # Model Observers
│   ├── RequestObserver.php
│   └── InventoryObserver.php
│
├── Events/                  # Events
│   ├── RequestApproved.php
│   └── StockLowEvent.php
│
├── Listeners/               # Event Listeners
│   ├── SendApprovalNotification.php
│   └── LogStockChange.php
│
├── Jobs/                    # Queue Jobs
│   ├── GeneratePDFJob.php
│   └── SyncMLPredictionJob.php
│
├── Mail/                    # Mailable classes
│   └── RequestApprovalMail.php
│
└── Providers/
    ├── AppServiceProvider.php
    └── RepositoryServiceProvider.php  # Bind interfaces ke implementations
```

---

## 🎨 Frontend Structure (Inertia React TypeScript)

### 2. **Atomic Design Pattern**

```
resources/
├── js/
│   ├── app.tsx                      # Entry point
│   ├── bootstrap.js                 # Axios setup
│   │
│   ├── Components/                  # Atomic Design Components
│   │   ├── Atoms/                   # Basic building blocks
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Icon.tsx
│   │   │
│   │   ├── Molecules/               # Simple component combinations
│   │   │   ├── FormField.tsx        # Label + Input + Error
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── DataTableHeader.tsx
│   │   │   └── StatusBadge.tsx
│   │   │
│   │   ├── Organisms/               # Complex components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── FormInventory.tsx
│   │   │   ├── RequestApprovalCard.tsx
│   │   │   └── InventoryCard.tsx
│   │   │
│   │   └── Templates/               # Page layouts
│   │       ├── AuthLayout.tsx
│   │       ├── DashboardLayout.tsx
│   │       └── GuestLayout.tsx
│   │
│   ├── Pages/                       # Inertia Pages (Routes)
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   │
│   │   ├── Dashboard/
│   │   │   └── Index.tsx
│   │   │
│   │   ├── Inventory/
│   │   │   ├── Index.tsx            # List inventory
│   │   │   ├── Create.tsx           # Form create
│   │   │   ├── Edit.tsx             # Form edit
│   │   │   └── Show.tsx             # Detail inventory
│   │   │
│   │   ├── Request/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Show.tsx
│   │   │   └── Approval.tsx
│   │   │
│   │   ├── Report/
│   │   │   ├── Index.tsx
│   │   │   └── Preview.tsx
│   │   │
│   │   ├── User/
│   │   │   ├── Index.tsx
│   │   │   └── Profile.tsx
│   │   │
│   │   └── Welcome.tsx
│   │
│   ├── Hooks/                       # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useTable.ts
│   │   ├── useForm.ts
│   │   ├── useDebounce.ts
│   │   ├── usePagination.ts
│   │   └── usePermission.ts
│   │
│   ├── Utils/                       # Utility functions
│   │   ├── formatters.ts            # Date, number, currency formatters
│   │   ├── validators.ts            # Client-side validation
│   │   ├── helpers.ts               # General helpers
│   │   └── constants.ts             # App constants
│   │
│   ├── Services/                    # API calls & external services
│   │   ├── api.ts                   # Axios instance
│   │   ├── inventoryService.ts
│   │   └── requestService.ts
│   │
│   ├── Stores/                      # State management (optional: Zustand/Context)
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   │
│   └── Types/                       # TypeScript definitions
│       ├── index.d.ts               # Global types
│       ├── models.ts                # Model types
│       ├── api.ts                   # API response types
│       └── props.ts                 # Component props types
│
└── css/
    └── app.css                      # Tailwind CSS
```

---

## 🔄 Data Flow Pattern

### Backend Flow (Repository Pattern)

```
Route → Controller → Service → Repository → Model → Database
                       ↓
                    DTO/Action
```

**Contoh:**
```php
// 1. Route
Route::post('/inventory', [InventoryController::class, 'store']);

// 2. Controller (thin layer)
class InventoryController extends Controller
{
    public function __construct(
        private InventoryService $inventoryService
    ) {}

    public function store(StoreInventoryRequest $request)
    {
        $inventory = $this->inventoryService->createInventory(
            CreateInventoryDTO::fromRequest($request)
        );

        return Inertia::render('Inventory/Show', [
            'inventory' => $inventory
        ]);
    }
}

// 3. Service (business logic)
class InventoryService
{
    public function __construct(
        private InventoryRepositoryInterface $repository
    ) {}

    public function createInventory(CreateInventoryDTO $dto): Inventory
    {
        // Business logic here
        DB::beginTransaction();
        try {
            $inventory = $this->repository->create($dto->toArray());
            event(new InventoryCreated($inventory));
            DB::commit();
            return $inventory;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}

// 4. Repository (data access)
class InventoryRepository implements InventoryRepositoryInterface
{
    public function create(array $data): Inventory
    {
        return Inventory::create($data);
    }
}
```

### Frontend Flow (Inertia + React)

```
User Interaction → Event Handler → Inertia Router → Laravel Backend
                       ↓
                   Local State (useState/Hooks)
                       ↓
                   Re-render Component
```

**Contoh:**
```tsx
// Page Component
export default function InventoryCreate({ categories }: Props) {
    const { data, setData, post, errors } = useForm({
        name: '',
        category_id: '',
        quantity: 0,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('inventory.store'));
    };

    return (
        <DashboardLayout>
            <FormInventory
                data={data}
                errors={errors}
                onChange={setData}
                onSubmit={handleSubmit}
            />
        </DashboardLayout>
    );
}
```

---

## 📋 Naming Conventions

### Backend (Laravel)

| Type | Convention | Example |
|------|-----------|---------|
| Controller | PascalCase + Controller | `InventoryController` |
| Service | PascalCase + Service | `InventoryService` |
| Repository | PascalCase + Repository | `InventoryRepository` |
| Model | PascalCase (singular) | `Inventory`, `User` |
| Migration | snake_case | `create_inventories_table` |
| Request | PascalCase + Request | `StoreInventoryRequest` |
| Resource | PascalCase + Resource | `InventoryResource` |
| Enum | PascalCase | `RequestStatus` |
| DTO | PascalCase + DTO | `CreateInventoryDTO` |
| Event | PascalCase (past tense) | `InventoryCreated` |
| Job | PascalCase + Job | `GeneratePDFJob` |

### Frontend (React TypeScript)

| Type | Convention | Example |
|------|-----------|---------|
| Component | PascalCase | `Button`, `FormField` |
| Page | PascalCase | `InventoryIndex`, `Dashboard` |
| Hook | camelCase + use prefix | `useAuth`, `useTable` |
| Utility | camelCase | `formatDate`, `calculateTotal` |
| Type/Interface | PascalCase | `User`, `InventoryProps` |
| Constant | UPPER_SNAKE_CASE | `API_BASE_URL` |
| File | Same as export | `Button.tsx`, `useAuth.ts` |

---

## 🎯 Best Practices

### Backend

1. **Controllers**: Hanya routing logic, tidak ada business logic
2. **Services**: Semua business logic di sini
3. **Repositories**: Hanya database queries
4. **DTOs**: Untuk transfer data antar layer
5. **Form Requests**: Validasi input
6. **Events/Listeners**: Untuk decoupling actions
7. **Jobs**: Untuk long-running tasks

### Frontend

1. **Atoms**: Reusable, no business logic
2. **Molecules**: Combine atoms, minimal logic
3. **Organisms**: Complex components, can have state
4. **Pages**: Inertia pages, orchestrate organisms
5. **Hooks**: Extract reusable logic
6. **Types**: Strong typing untuk semua props & data
7. **Utils**: Pure functions, no side effects

---

## 📦 File Organization Tips

### ✅ DO
- Group by feature/domain (Inventory, Request, Report)
- Keep files small and focused
- Use index files for cleaner imports
- Separate concerns (presentation vs logic)

### ❌ DON'T
- Mix business logic in controllers
- Put everything in one giant file
- Use generic names (Manager, Handler, Util)
- Duplicate code across components

---

## 🔗 Import Aliases

Gunakan path alias untuk import yang lebih bersih:

```typescript
// ❌ Bad
import Button from '../../../Components/Atoms/Button';

// ✅ Good
import Button from '@/Components/Atoms/Button';
```

Sudah dikonfigurasi di:
- `tsconfig.json` → `"@/*": ["resources/js/*"]`
- `vite.config.js` → `alias: { '@': '/resources/js' }`

---

## 🧪 Testing Structure

```
tests/
├── Feature/                 # Integration tests
│   ├── Auth/
│   ├── Inventory/
│   └── Request/
│
└── Unit/                    # Unit tests
    ├── Services/
    ├── Repositories/
    └── DTOs/
```

Frontend tests (jika ada):
```
resources/js/__tests__/
├── Components/
├── Hooks/
└── Utils/
```

---

## 📚 References

- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
