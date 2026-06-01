# Current UI Analysis

This document provides an analysis of the existing UI components and pages within the `app/*`, `components/*`, `hooks/*`, and `lib/*` directories, excluding `node_modules`, `.next`, and `public`.

## 1. Existing Pages

The following are identified as existing pages based on the `app/*/page.tsx` pattern:

- `app/page.tsx` (Homepage)
- `app/admin/page.tsx` (Admin Dashboard)
- `app/dang-ky-mon/page.tsx` (Course Registration Page)
- `app/hoc-phi/page.tsx` (Tuition Fees Page)
- `app/ket-qua-hoc-tap/page.tsx` (Study Results Page)
- `app/login/page.tsx` (Login Page)
- `app/thoi-khoa-bieu/page.tsx` (Schedule/Timetable Page)

## 2. Existing Reusable Components

These components are likely designed for reuse across different parts of the application or provide general UI functionality:

- `components/antd-provider.tsx` (Ant Design Provider)
- `components/gpa-chart.tsx` (GPA Chart for displaying academic performance)
- `components/header.tsx` (Global application header)
- `components/notifications-panel.tsx` (Panel for displaying notifications)
- `components/schedule-panel.tsx` (Panel for displaying schedules)
- `components/sidebar.tsx` (General application sidebar)
- `components/stats-cards.tsx` (Cards for displaying statistics)
- `components/theme-provider.tsx` (Theme context provider)
- `components/welcome-banner.tsx` (Welcome message banner)
- `components/admin/admin-header.tsx` (Admin specific header)
- `components/admin/admin-sidebar.tsx` (Admin specific sidebar)
- **UI Library Components (`components/ui/*`):**
  - `accordion.tsx`, `alert-dialog.tsx`, `alert.tsx`, `aspect-ratio.tsx`, `avatar.tsx`, `badge.tsx`, `breadcrumb.tsx`, `button-group.tsx`, `button.tsx`, `calendar.tsx`, `card.tsx`, `carousel.tsx`, `chart.tsx`, `checkbox.tsx`, `collapsible.tsx`, `command.tsx`, `context-menu.tsx`, `dialog.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `empty.tsx`, `field.tsx`, `form.tsx`, `hover-card.tsx`, `input-group.tsx`, `input-otp.tsx`, `input.tsx`, `item.tsx`, `kbd.tsx`, `label.tsx`, `menubar.tsx`, `navigation-menu.tsx`, `pagination.tsx`, `popover.tsx`, `progress.tsx`, `radio-group.tsx`, `resizable.tsx`, `scroll-area.tsx`, `select.tsx`, `separator.tsx`, `sheet.tsx`, `sidebar.tsx`, `skeleton.tsx`, `slider.tsx`, `sonner.tsx`, `spinner.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`, `toast.tsx`, `toaster.tsx`, `toggle-group.tsx`, `toggle.tsx`, `tooltip.tsx`

## 3. Existing Registration-Related Components

These components are specifically related to the course registration process:

- `app/dang-ky-mon/page.tsx` (The main page for course registration)
- `components/course-registration/course-filters.tsx` (Filters for course selection)
- `components/course-registration/course-table.tsx` (Table displaying available courses)
- `components/course-registration/registered-courses.tsx` (Displays courses the user has registered for)
- `components/course-registration/timetable-preview.tsx` (Preview of the student's timetable based on selected courses)

## 4. Components Reusable for Backend Integration

These components are likely candidates for direct or indirect interaction with a backend API for data fetching, submission, or display:

- `components/gpa-chart.tsx`: Displays data likely fetched from a backend (e.g., student's GPA history).
- `components/notifications-panel.tsx`: Fetches and displays user-specific notifications from the backend.
- `components/schedule-panel.tsx`: Displays schedule data, which would be fetched from a backend.
- `components/stats-cards.tsx`: Displays various statistics that would originate from backend data.
- `components/welcome-banner.tsx`: Could display user-specific welcome messages or data points from the backend.
- `components/admin/admin-header.tsx` and `components/admin/admin-sidebar.tsx`: Admin components often involve fetching and managing system-level data, user roles, or configuration from a backend.
- **Course Registration Components (`components/course-registration/*`):** All components in this directory are inherently tied to backend integration for managing courses, student registrations, and timetable data.
  - `course-filters.tsx`: Likely sends filter criteria to the backend to fetch courses.
  - `course-table.tsx`: Displays courses fetched from the backend, potentially with actions to register.
  - `registered-courses.tsx`: Fetches and displays the user's currently registered courses.
  - `timetable-preview.tsx`: Generates a timetable based on selected courses, which might involve backend validation or data fetching.
- **UI Form/Input Components (`components/ui/form.tsx`, `components/ui/input.tsx`, `components/ui/select.tsx`, `components/ui/table.tsx`, etc.):** These generic UI components are foundational for building forms that submit data to a backend or tables that display data retrieved from a backend. They provide the structure for user interaction that ultimately communicates with the API.