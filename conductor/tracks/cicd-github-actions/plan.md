# Track: Implementasi GitHub Actions CI/CD

## Metadata
- **Track ID**: `cicd-github-actions`
- **Status**: ✅ Completed
- **Prioritas**: Tinggi
- **Deskripsi**: Implementasi pipeline CI/CD otomatis menggunakan GitHub Actions agar proses deploy ke VPS Production tidak perlu dilakukan manual via SSH. Pipeline akan berjalan setiap kali ada push ke branch `production`.

---

## Arsitektur Pipeline

```
Push ke branch production
        │
        ▼
┌─────────────────────────────┐
│   JOB 1: CI (Build & Test)  │
│  ─────────────────────────  │
│  1. Checkout kode           │
│  2. Setup PHP 8.2           │
│  3. Cache & Install Composer│
│  4. Setup Node.js 20        │
│  5. npm ci + npm run build  │
│  6. Siapkan .env (test)     │
│  7. php artisan migrate     │
│  8. php artisan test        │
└────────────┬────────────────┘
             │ Jika LOLOS
             ▼
┌─────────────────────────────┐
│  JOB 2: CD (Deploy ke VPS)  │
│  ─────────────────────────  │
│  Via SSH (appleboy/ssh):    │
│  1. cd APP_PATH             │
│  2. git pull origin prod    │
│  3. php artisan down        │
│  4. composer install --prod │
│  5. npm ci + npm run build  │
│  6. php artisan migrate     │
│  7. artisan config:cache    │
│  8. artisan route:cache     │
│  9. artisan view:cache      │
│  10. artisan event:cache    │
│  11. storage:link --force   │
│  12. queue:restart          │
│  13. php artisan up         │
└─────────────────────────────┘
```

---

## File yang Dibuat

- **`.github/workflows/deploy.yml`** — File workflow GitHub Actions utama.

---

## Konfigurasi GitHub Secrets yang Wajib Diisi

Buka: `GitHub Repo → Settings → Secrets and variables → Actions → New repository secret`

| Secret Name | Keterangan | Contoh Nilai |
|---|---|---|
| `SSH_HOST` | IP address atau hostname VPS | `103.x.x.x` atau `simpatik.example.com` |
| `SSH_USER` | Username SSH di VPS | `ubuntu` / `root` / `deploy` |
| `SSH_PRIVATE_KEY` | Isi file private key SSH (bukan path, tapi isinya) | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` |
| `SSH_PORT` | Port SSH (default: 22) | `22` |
| `APP_PATH` | Path absolut folder proyek di VPS | `/var/www/simpatik` |

### Cara Generate SSH Key (jika belum ada):
```bash
# Jalankan di terminal lokal
ssh-keygen -t ed25519 -C "github-actions-simpatik" -f ~/.ssh/github_actions_simpatik

# Copy public key ke server (authorized_keys)
ssh-copy-id -i ~/.ssh/github_actions_simpatik.pub user@your-server-ip

# Isi SSH_PRIVATE_KEY dengan isi file private key:
cat ~/.ssh/github_actions_simpatik
```

---

## Konfigurasi GitHub Environment (Opsional tapi Disarankan)

Buka: `GitHub Repo → Settings → Environments → New environment`

1. Buat environment bernama **`production`**
2. Aktifkan **"Required reviewers"** jika ingin approval manual sebelum deploy
3. Tambahkan **"Deployment branches"** → pilih `production` saja

---

## Checklist Setup di VPS (Prasyarat Sebelum Pipeline Bisa Jalan)

- [ ] Git sudah terinstall di VPS
- [ ] PHP 8.2 + extension (mbstring, pdo_mysql, gd, zip, xml, bcmath) sudah terinstall
- [ ] Composer sudah terinstall secara global
- [ ] Node.js 20 + npm sudah terinstall
- [ ] Folder proyek (`APP_PATH`) sudah di-clone dari repo GitHub
- [ ] File `.env` production sudah ada di VPS (bukan dari repo, harus dibuat manual)
- [ ] `php artisan storage:link` sudah pernah dijalankan minimal sekali
- [ ] Web server (Nginx/Apache) sudah dikonfigurasi mengarah ke `public/`
- [ ] Database MySQL sudah berjalan dan sudah di-migrate
- [ ] User SSH memiliki permission untuk menulis ke direktori proyek

---

## Cara Kerja Sehari-hari

```bash
# Developer selesai mengerjakan fitur di branch dev
git checkout production
git merge dev
git push origin production
# → GitHub Actions otomatis berjalan!
# → CI test → jika lolos → Deploy ke VPS → artisan up
```

---

## Troubleshooting Umum

| Masalah | Solusi |
|---|---|
| `Permission denied (publickey)` | Pastikan public key sudah ada di `~/.ssh/authorized_keys` di VPS |
| `npm: command not found` di VPS | Install Node.js di VPS: `curl -fsSL https://deb.nodesource.com/setup_20.x \| sudo -E bash - && sudo apt install -y nodejs` |
| `php artisan: command not found` | Pastikan PHP 8.2 ada di PATH atau gunakan path absolut `/usr/bin/php8.2` |
| Test gagal di CI tapi lokal aman | Cek konfigurasi MySQL di step `Siapkan environment untuk testing` |
| Deploy stuck di `artisan down` | Pastikan file `.env` ada dan `APP_KEY` sudah di-set di VPS |
