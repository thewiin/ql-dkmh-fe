# Project Cleanup Report

**Project:** `ql-dkmh-fe` (PNUni – Portal Sinh Viên)  
**Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Axios  
**Analysis date:** 2026-06-02  
**Scope:** Static import/reference scan and content review. No code was modified.

---

## Executive summary

This repository is primarily a **UI prototype** scaffolded from v0/shadcn, with a thin API layer (`lib/api.ts`, `services/*`) that is **mostly unwired**. Student and admin screens render **inline mock data**; only `app/login/page.tsx` calls the backend via `auth.service.ts`.

Cleanup opportunities fall into five buckets:

| Category | Approx. impact |
|----------|----------------|
| Unused shadcn/ui primitives | ~42 files under `components/ui/` |
| Unused providers & hooks | 4 files + stub auth context |
| Unreferenced services | 5 of 6 service modules |
| Duplicate / parallel implementations | 4 pairs |
| Stale docs, assets, dependencies | 2 analysis docs, missing `public/` assets, 3+ npm packages |

---

## 1. Unused files

### 1.1 Never imported by application code

These files are not referenced from `app/`, feature `components/`, or `hooks/` (except where noted as self-contained UI kit).

| Path | Notes |
|------|--------|
| `components/antd-provider.tsx` | Ant Design `ConfigProvider`; not mounted in `app/layout.tsx` |
| `components/theme-provider.tsx` | `next-themes` wrapper; never used |
| `styles/globals.css` | Duplicate of `app/globals.css`; `components.json` points at `app/globals.css` only |
| `hooks/use-mobile.ts` | Only consumed by unused `components/ui/sidebar.tsx` |
| `components/ui/use-mobile.tsx` | Duplicate of `hooks/use-mobile.ts`; unused |
| `components/ui/use-toast.ts` | Duplicate of `hooks/use-toast.ts`; unused |
| `components/ui/toaster.tsx` | Not mounted in root layout |
| `components/ui/sonner.tsx` | Toast alternative; never mounted |

### 1.2 Unused shadcn/ui components (`components/ui/`)

Only **14** UI primitives are used by pages/features:

`alert`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `input`, `label`, `progress`, `radio-group`, `select`, `table`, `tabs`

The following **42** UI files appear unused (no imports from `app/`, `components/*` outside `ui/`, or `hooks/`):

`accordion`, `alert-dialog`, `aspect-ratio`, `avatar`, `breadcrumb`, `button-group`, `calendar`, `carousel`, `chart`, `collapsible`, `command`, `context-menu`, `drawer`, `empty`, `field`, `form`, `hover-card`, `input-group`, `input-otp`, `item`, `kbd`, `menubar`, `navigation-menu`, `pagination`, `popover`, `resizable`, `scroll-area`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `textarea`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`

Some of these only reference each other (e.g. `command` → `dialog`, `ui/sidebar` → `sheet`, `skeleton`, `tooltip`), forming a **disconnected subgraph** with no entry from real pages.

### 1.3 Service layer (implemented but not used by UI)

| Service | Used by UI? |
|---------|-------------|
| `services/auth.service.ts` | Yes — `app/login/page.tsx` (`login` only) |
| `services/dashboard.service.ts` | No |
| `services/dangKy.service.ts` | No |
| `services/lopHocPhan.service.ts` | No |
| `services/phieuThu.service.ts` | No |
| `services/sinhVien.service.ts` | No |

`lib/api.ts` is only pulled in through services; it is **live** for login but idle elsewhere.

### 1.4 Auth hook (partially wired, functionally dead)

| Path | Status |
|------|--------|
| `hooks/use-auth.ts` | `AuthProvider` wraps the app in `app/layout.tsx`, but `useAuth()` is **never called**. Context exposes stub field `test: "Hello"` only. |

### 1.5 Documentation artifacts (not runtime code)

| Path | Notes |
|------|--------|
| `PROJECT_ANALYSIS.md` | Prior analysis; references non-existent `api/` folder and `public/placeholder-*` assets |
| `CURRENT_UI_ANALYSIS.md` | UI notes; safe to archive or merge |

### 1.6 Missing / broken static asset references

`app/layout.tsx` metadata references files **not present** under `public/`:

- `icon-light-32x32.png`
- `icon-dark-32x32.png`
- `apple-icon.png`

Only `public/icon.svg` exists today.

### 1.7 Lockfile redundancy

Both `package-lock.json` and `pnpm-lock.yaml` are present. Pick one package manager to avoid drift.

---

## 2. Duplicate components

### 2.1 Navigation shells (intentional roles, duplicated structure)

| Student | Admin | Overlap |
|---------|-------|---------|
| `components/sidebar.tsx` | `components/admin/admin-sidebar.tsx` | Same layout: logo, nav list, profile footer; different links and styling |
| `components/header.tsx` | `components/admin/admin-header.tsx` | Search + notifications; admin adds semester `DropdownMenu` |

**Recommendation:** Extract shared `AppShell`, `NavItem`, and `TopBar` primitives; keep role-specific menu config in data files.

### 2.2 Identical hook duplicates (byte-for-byte equivalent logic)

| File A | File B |
|--------|--------|
| `hooks/use-mobile.ts` | `components/ui/use-mobile.tsx` |
| `hooks/use-toast.ts` | `components/ui/use-toast.ts` |

`components/ui/sidebar.tsx` imports `@/hooks/use-mobile`; the `components/ui/use-mobile.tsx` copy is redundant.

### 2.3 Parallel sidebar implementations

| Component | Purpose |
|-----------|---------|
| `components/sidebar.tsx` | Custom student sidebar (used) |
| `components/ui/sidebar.tsx` | shadcn collapsible sidebar kit (unused) |

Do not confuse the two when cleaning up.

### 2.4 Type definitions vs page-local models

| Location | Issue |
|----------|--------|
| `app/dang-ky-mon/page.tsx` | Exports `Course`, `RegisteredCourse` |
| `components/course-registration/*.tsx` | Import types from the **page** (`@/app/dang-ky-mon/page`) |

Domain types should live in `types/` (alongside `LopHocPhan`, `DangKy`, etc.) to avoid coupling components to route files.

---

## 3. Dead code

### 3.1 Unused exports and methods

| Symbol | Location | Notes |
|--------|----------|-------|
| `useAuth()` | `hooks/use-auth.ts` | Never imported |
| `AuthService.logout` | `services/auth.service.ts` | Never called |
| `AuthService.getProfile` | `services/auth.service.ts` | Never called |
| `MonHoc` interface | `types/index.ts` | Exported but never imported (only embedded in `LopHocPhan`) |
| `_geist`, `_geistMono` | `app/layout.tsx` | Fonts instantiated but class names not applied to `<body>` |

### 3.2 Commented / disabled logic

| Location | Snippet |
|----------|---------|
| `lib/api.ts` | 401 handler logs only; redirect to `/login` is commented out |
| `app/login/page.tsx` | `response` from login unused; errors only `console.error` (TODO at line 47) |

### 3.3 npm dependencies with no app imports

| Package | Evidence |
|---------|----------|
| `react-router-dom` | Listed in `package.json`; no imports in source (Next.js App Router handles routing) |
| `antd`, `@ant-design/icons` | Only referenced in unused `components/antd-provider.tsx` |
| `@hookform/resolvers`, `zod` | No imports outside unused `components/ui/form.tsx` |
| `cmdk` | Only used by unused `components/ui/command.tsx` |
| `vaul` | Only used by unused `components/ui/drawer.tsx` |
| `embla-carousel-react` | Only used by unused `components/ui/carousel.tsx` |
| `input-otp` | Only used by unused `components/ui/input-otp.tsx` |

`recharts` and `lucide-react` are actively used on dashboard/grades/admin pages.

---

## 4. Duplicate services

Services are not copy-paste duplicates, but they expose **overlapping API responsibilities** that should be consolidated when wiring the UI.

| Overlap | Endpoints / methods |
|---------|---------------------|
| **PhieuThu by student** | `sinhVien.service.ts` → `GET /sinhvien/{id}/phieuthu` vs `phieuThu.service.ts` → `GET /phieuthu/sinhvien/{maSinhVien}` |
| **Recent registrations** | `dashboard.service.ts` → `GET /dashboard/recent-registrations` vs `dangKy.service.ts` → `GET /dangky/sinhvien/{maSinhVien}` |
| **Recent receipts** | `dashboard.service.ts` → `GET /dashboard/recent-receipts` vs `phieuThu.service.ts` CRUD/list |

**Recommendation:** Choose one canonical client per aggregate (`SinhVien`, `DangKy`, `PhieuThu`, `LopHocPhan`) and thin dashboard methods to composed calls or BFF endpoints.

---

## 5. Mock data

All mock data is **inline** in page or component files (no `__mocks__/` or `fixtures/` folder).

### 5.1 Pages with explicit mock blocks

| File | Mock identifiers | Lines (approx.) |
|------|------------------|-----------------|
| `app/dang-ky-mon/page.tsx` | `mockCourses` (8 courses) | 35–126 |
| `app/hoc-phi/page.tsx` | `tuitionSummary`, `courseTuition`, `otherFees`, `paymentHistory`, `invoices` | 51–89 |
| `app/ket-qua-hoc-tap/page.tsx` | `gpaHistory`, `gradeDistribution`, skills radar, course tables | 61+ |
| `app/thoi-khoa-bieu/page.tsx` | `scheduleData` (`CourseBlock[]`) | 69+ |
| `app/admin/page.tsx` | `statsCards`, chart series, activity tables | 62+ |
| `app/admin/quan-ly-lop/page.tsx` | `initialClasses` (`ClassSection[]`) | 81+ |

### 5.2 Components with hardcoded demo content

| File | Data |
|------|------|
| `components/welcome-banner.tsx` | Hardcoded name "Nguyễn Văn A" |
| `components/stats-cards.tsx` | `stats` array (GPA, credits, tuition) |
| `components/gpa-chart.tsx` | `gpaData` semester series |
| `components/schedule-panel.tsx` | `scheduleItems` (4 classes) |
| `components/notifications-panel.tsx` | `notifications` (3 items) |
| `components/sidebar.tsx` | Profile "Nguyễn Văn A" / `SV2024001` |
| `components/admin/admin-sidebar.tsx` | Admin profile footer (static) |

### 5.3 Partial API integration

| File | Integration |
|------|-------------|
| `app/login/page.tsx` | Calls `AuthService.login`; does not use `AuthProvider` / JWT in other pages |

---

## 6. Demo / prototype pages

There is no `/demo` route. The following routes behave as **high-fidelity UI demos** (mock-driven):

| Route | File | Role |
|-------|------|------|
| `/` | `app/page.tsx` | Student dashboard demo |
| `/dang-ky-mon` | `app/dang-ky-mon/page.tsx` | Course registration demo |
| `/thoi-khoa-bieu` | `app/thoi-khoa-bieu/page.tsx` | Timetable demo |
| `/hoc-phi` | `app/hoc-phi/page.tsx` | Tuition & payments demo |
| `/ket-qua-hoc-tap` | `app/ket-qua-hoc-tap/page.tsx` | Grades & analytics demo |
| `/admin` | `app/admin/page.tsx` | Admin dashboard demo |
| `/admin/quan-ly-lop` | `app/admin/quan-ly-lop/page.tsx` | Class section management demo |
| `/login` | `app/login/page.tsx` | Login UI + API hookup (partial) |

### 6.1 Phantom routes (linked but no `page.tsx`)

**Student sidebar** (`components/sidebar.tsx`):

- `/ho-so` — "Hồ sơ cá nhân" → **404**

**Admin sidebar** (`components/admin/admin-sidebar.tsx`):

- `/admin/sinh-vien`
- `/admin/giang-vien`
- `/admin/mon-hoc`
- `/admin/hoc-phi`
- `/admin/bao-cao`
- `/admin/thong-bao`
- `/admin/cai-dat`

Only `/admin` and `/admin/quan-ly-lop` exist under `app/admin/`.

---

## 7. Placeholder files & scaffold markers

| Item | Type | Notes |
|------|------|--------|
| `package.json` → `"name": "my-project"` | Config placeholder | Should reflect `ql-dkmh-fe` or product name |
| `app/layout.tsx` metadata `generator: 'v0.app'` | Scaffold marker | Indicates v0-generated UI |
| Missing `public/icon-*.png`, `apple-icon.png` | Broken asset placeholders | Referenced in metadata only |
| `PROJECT_ANALYSIS.md` placeholder list | Stale documentation | Mentions `placeholder-logo.png`, `placeholder.svg`, etc. — **not in repo** |
| `styles/globals.css` | Orphan duplicate | Likely leftover from template |
| `hooks/use-auth.ts` | Stub placeholder | Not a real auth implementation |
| Input `placeholder` attributes | UX copy | Normal; not cleanup targets |

---

## 8. Suggested cleanup priority

### P0 — Low risk, high clarity

1. Remove or archive duplicate hooks (`components/ui/use-toast.ts`, `components/ui/use-mobile.tsx`).
2. Delete unused providers (`antd-provider`, `theme-provider`) **or** wire them in layout (choose one design system).
3. Remove `styles/globals.css` if confirmed duplicate of `app/globals.css`.
4. Fix `public/` icons or trim `app/layout.tsx` metadata.
5. Remove phantom nav links or add stub pages.

### P1 — Reduce bundle / maintenance

1. Prune unused `components/ui/*` (42 files) after confirming no dynamic imports.
2. Remove unused npm packages (`react-router-dom`, `antd` if staying on shadcn, etc.).
3. Drop unused services until pages need them, **or** wire one page end-to-end as a pattern.

### P2 — Structural improvements

1. Move mock data to `lib/mocks/` or fetch from API; replace hardcoded user names with `AuthService.getProfile`.
2. Consolidate `header` / `admin-header` and `sidebar` / `admin-sidebar`.
3. Implement real `use-auth` (token, role, profile) and route guards.
4. Unify `types/` with page-local `Course` / `ClassSection` interfaces.
5. Resolve duplicate PhieuThu / DangKy service endpoints with backend team.

---

## 9. Methodology & limitations

- **Method:** Ripgrep for `@/` imports, `services/*` usage, and keywords (`mock`, `TODO`, `placeholder`). Manual review of layouts, sidebars, and service files.
- **Not run:** `next build`, ESLint `no-unused-vars`, or dead-code elimination tools (e.g. `knip`, `ts-prune`). Some UI files might be intended for near-term use—confirm with the team before deletion.
- **False positives:** None expected for services; UI unused list may shrink if you plan to adopt more shadcn components soon.

---

## 10. File inventory snapshot

| Area | Count (approx.) |
|------|-----------------|
| App routes (`page.tsx`) | 8 |
| Feature components | 14 |
| UI primitives (`components/ui`) | 56 |
| Services | 6 (1 wired) |
| Hooks | 3 (`use-auth`, `use-toast`, `use-mobile`) |

---

*Report generated for cleanup planning only. No source files were modified during this analysis.*
