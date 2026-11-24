# etotalsports.com - Hostinger Deployment & Git Setup

## 1. Project Overview & Environment Details

- **Local Path:** `C:\xampp\htdocs\works\etotalsports-wp`
- **Target Hostinger Server:** `167.88.47.8`
- **SSH Port:** `65002` *(Standard port 22 is closed on Hostinger)*
- **SSH User:** `u420563260`
- **Backend Admin & API URL:** `https://admin.etotalsports.com`
- **Frontend Storefront URL:** `https://etotalsports.com` (pointed to Vercel)
- **Hostinger Target Path (WP Backend):** `domains/etotalsports.com/public_html/admin/`
- **Live WP Core Version:** Clean WordPress install (PHP 8.3)
- **SSH Key Pair:** Uses `~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub` on this PC (`Lenovo Yoga 730`).

---

## 2. Fast SSH Connection from this PC

An SSH alias has been configured in `~/.ssh/config`. You can connect directly:
```bash
ssh etotalsports
# or
ssh hostinger
```

Direct WP-CLI command example for the active backend:
```bash
ssh etotalsports "wp --path=domains/etotalsports.com/public_html/admin core version"
```

---

## 3. GitHub & Deployment Architecture

- **GitHub Account:** `harunr` (`md.rashidh@gmail.com`)
- **Remote URL:** `https://github.com/harunr/etotalsports.git`
- **CI/CD:** GitHub Actions on push to `master`/`main`

### GitHub Secrets Required in Repository:
| Secret Name | Value |
| :--- | :--- |
| `SSH_HOST` | `167.88.47.8` |
| `SSH_PORT` | `65002` |
| `SSH_USER` | `u420563260` |
| `SSH_PRIVATE_KEY` | Contents of `C:\Users\Lenovo Yoga 730\.ssh\id_rsa` |

### Critical Hostinger Deployment Safety Rules:
1. **Never rsync whole `wp-content/` with `--delete`:**
   - Scope `--delete` strictly to the custom theme or plugin folder.
2. **`mu-plugins/` must be copy-only:**
   - Never use `--delete` on `mu-plugins/` because Hostinger drop-ins and object caches live there.
3. **LiteSpeed Cache Purge:**
   - Always purge LiteSpeed cache after deployment:
     ```bash
     ssh etotalsports "wp --path=domains/etotalsports.com/public_html/admin litespeed-purge all || true"
     ```
4. **Database Backups:**
   - Hostinger restricts `exec`, `shell_exec` in PHP (making `wp db export` fail).
   - Use direct bash `mysqldump` over SSH for backups.

---

## 4. Headless CMS Roadmap

- **Status:** Backend active at `https://admin.etotalsports.com`. Full website design will be provided by the user before frontend build begins.
- **Backend:** WordPress REST API / Headless integration on Hostinger (`domains/etotalsports.com/public_html/admin/`).
- **Frontend:** Decoupled modern frontend (Next.js App Router, Tailwind CSS, TypeScript).
