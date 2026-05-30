---
description: "Task list for US-001 Pantalla de autenticación"
---

# Tasks: Pantalla de autenticación (US-001)

**Input**: Design documents from `/specs/001-pantalla-autenticacion/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluidos (TDD obligatorio — constitución Principle III + plan.md). Vitest + Testing Library, tests co-located `*.test.ts(x)` bajo `src/features/auth/`.

**Organization**: Tareas agrupadas por user story (US1–US4) para entrega incremental e independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralelizable (archivos distintos, sin dependencias pendientes)
- **[Story]**: US1–US4 según spec.md
- Rutas exactas en cada descripción

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estructura base del repo y primitivas UI reutilizables

- [x] T001 Create auth feature folder structure per plan.md (`src/features/auth/components/`, `src/features/auth/lib/`)
- [x] T002 [P] Add route path constants (`LOGIN_PATH`, `HOME_PATH`) in `src/shared/constants/routes.ts`
- [x] T003 [P] Create Base UI wrapper `Button` in `src/components/ui/button.tsx`
- [x] T004 [P] Create Base UI wrapper `Input` in `src/components/ui/input.tsx`
- [x] T005 [P] Create Base UI wrapper `Field` (label + control) in `src/components/ui/field.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Dominio auth mock, store y cookie — **bloquea todas las user stories**

**⚠️ CRITICAL**: Ninguna user story comienza hasta completar esta fase

- [x] T006 Define `AuthSession`, `LoginCredentials`, `AuthResult`, `AuthError` types in `src/features/auth/lib/types.ts`
- [x] T007 [P] RED: Write failing tests for `validateCredentials` per `contracts/mock-auth-service.md` in `src/features/auth/lib/auth-service.mock.test.ts`
- [x] T008 [P] RED: Write failing tests for `useAuthStore` login/logout/persist in `src/features/auth/lib/auth-store.test.ts`
- [x] T009 GREEN: Implement `validateCredentials` in `src/features/auth/lib/auth-service.mock.ts`
- [x] T010 GREEN: Implement `useAuthStore` with Zustand persist key `auth:demo:v1` in `src/features/auth/lib/auth-store.ts`
- [x] T011 Implement cookie sync helpers (`setSessionCookie`, `clearSessionCookie`) in `src/features/auth/lib/session-cookie.ts`
- [x] T012 Wire store login/logout to call session-cookie helpers in `src/features/auth/lib/auth-store.ts`
- [x] T013 Export public auth API from `src/features/auth/index.ts`

**Checkpoint**: Store mock operativo; tests de servicio y store en verde

---

## Phase 3: User Story 1 — Iniciar sesión y acceder al resumen (Priority: P1) 🎯 MVP

**Goal**: Formulario login (usuario/contraseña obligatorios) → sesión mock → redirección a `/` (**SC-02**, **FR-001**, **FR-002**)

**Independent Test**: Visitante sin sesión completa login con credenciales no vacías y llega a `/` autenticado (contenido stub visible)

### Tests for User Story 1

> **NOTE: Escribir tests primero; deben FALLAR antes de implementar**

- [x] T014 [P] [US1] RED: Write failing tests for `LoginForm` validation and submit in `src/features/auth/components/LoginForm.test.tsx`

### Implementation for User Story 1

- [x] T015 [US1] GREEN: Implement `LoginForm` with required username/password fields per `contracts/ui-login-screen.md` in `src/features/auth/components/LoginForm.tsx`
- [x] T016 [US1] Create `LoginPage` layout shell in `src/features/auth/components/LoginPage.tsx`
- [x] T017 [US1] Compose login route in `src/app/login/page.tsx` importing `LoginPage`
- [x] T018 [US1] Wire form submit to `useAuthStore.login`, sync cookie, and `router.push(HOME_PATH)` in `src/features/auth/components/LoginForm.tsx`
- [x] T019 [US1] Create minimal authenticated resumen stub (placeholder US-002) in `src/app/page.tsx`

**Checkpoint**: SC-02 verificable vía quickstart; login UI presente en `/login`

---

## Phase 4: User Story 2 — Proteger rutas y redirigir al login (Priority: P1)

**Goal**: Mecanismo de rutas protegidas; `/` exige sesión; sin sesión → `/login` (**SC-01**, **FR-004**)

**Independent Test**: Ventana privada, navegar a `http://localhost:3000/` → redirección a `/login` sin ver contenido protegido

### Tests for User Story 2

- [x] T020 [P] [US2] RED: Write failing tests for protected routes catalog in `src/features/auth/lib/protected-routes.test.ts`
- [x] T021 [P] [US2] RED: Write failing tests for redirect resolution logic in `src/features/auth/lib/auth-redirect.test.ts`

### Implementation for User Story 2

- [x] T022 [US2] GREEN: Implement `PROTECTED_ROUTES` catalog (initial path `/`) in `src/features/auth/lib/protected-routes.ts`
- [x] T023 [US2] GREEN: Implement pure redirect resolver used by proxy in `src/features/auth/lib/auth-redirect.ts`
- [x] T024 [US2] Implement edge guard `proxy.ts` at repo root with matcher `['/','/login']` per `contracts/route-guard.md`
- [x] T025 [US2] Wrap resumen stub with client auth check fallback in `src/app/page.tsx` (complemento al proxy)

**Checkpoint**: SC-01 verificable; catálogo extensible en `protected-routes.ts`

---

## Phase 5: User Story 3 — Evitar login duplicado (Priority: P2)

**Goal**: Usuario autenticado en `/login` → redirección a `/` sin formulario (**SC-03**, **FR-003**)

**Independent Test**: Con sesión activa, abrir `/login` → termina en `/` sin renderizar formulario

### Tests for User Story 3

- [x] T026 [P] [US3] RED: Extend failing tests for authenticated `/login` → `/` in `src/features/auth/lib/auth-redirect.test.ts`

### Implementation for User Story 3

- [x] T027 [US3] GREEN: Extend `auth-redirect.ts` and `proxy.ts` to redirect `/login` when `demo-auth-session` cookie exists
- [x] T028 [US3] Add client-side redirect guard for hydrated session in `src/app/login/page.tsx`

**Checkpoint**: SC-03 verificable en navegación directa y tras hidratación

---

## Phase 6: User Story 4 — Cerrar sesión con destino único (Priority: P2)

**Goal**: Logout desde ≥2 puntos UI; siempre destino `/login` (**SC-04**, **FR-005**, **MO-003**)

**Independent Test**: Logout desde header y desde stub resumen → mismo destino `/login`; `/` inaccesible sin re-login

### Tests for User Story 4

- [x] T029 [P] [US4] RED: Write failing tests for `LogoutButton` clear session and navigation in `src/features/auth/components/LogoutButton.test.tsx`

### Implementation for User Story 4

- [x] T030 [US4] GREEN: Implement `LogoutButton` calling store logout + cookie clear in `src/features/auth/components/LogoutButton.tsx`
- [x] T031 [US4] Create `AuthenticatedShell` with header logout in `src/features/auth/components/AuthenticatedShell.tsx`
- [x] T032 [US4] Integrate `AuthenticatedShell` wrapping resumen stub in `src/app/page.tsx`
- [x] T033 [US4] Add second logout control on resumen body in `src/app/page.tsx` (MO-003: dos orígenes distintos)

**Checkpoint**: SC-04 y MO-003 verificables; destino único `/login`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: i18n, diseño Figma, quality gates y validación end-to-end

- [x] T034 [P] Set `lang="es"` and demo app metadata in `src/app/layout.tsx`
- [x] T035 [P] Apply DESIGN.md tokens and Figma node `1-3167` styling to `src/features/auth/components/LoginPage.tsx` and `LoginForm.tsx` (**FR-007**, **MO-004**)
- [x] T036 Run quality gate: `npm run lint`, `npm run test:run`, `npm run build`
- [x] T037 Validate manual scenarios SC-01–SC-04 per `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — inicio inmediato
- **Foundational (Phase 2)**: Depende de Setup — **bloquea US1–US4**
- **User Stories (Phase 3–6)**: Dependen de Foundational
  - US1 (Phase 3) antes de demo login completa
  - US2 (Phase 4) requiere stub `/` de US1 (T019)
  - US3 (Phase 5) requiere proxy y login route (US2 + US1)
  - US4 (Phase 6) requiere zona autenticada (US1 stub + US2 guard)
- **Polish (Phase 7)**: Tras US1–US4 deseadas

### User Story Dependencies

| Story    | Depende de          | Entrega independiente       |
| -------- | ------------------- | --------------------------- |
| US1 (P1) | Foundational        | Login + redirect a stub `/` |
| US2 (P1) | Foundational + T019 | SC-01 vía proxy             |
| US3 (P2) | US1 + US2           | SC-03 redirect login        |
| US4 (P2) | US1 + US2           | SC-04 logout dual           |

### Within Each User Story

1. Tests RED → implementación GREEN → refactor
2. Lib/store antes que componentes
3. Componentes antes que rutas `src/app/`
4. Checkpoint manual antes de siguiente fase

### Parallel Opportunities

- **Phase 1**: T002–T005 en paralelo tras T001
- **Phase 2**: T007 y T008 en paralelo; T009–T012 secuenciales
- **Phase 3**: T014 paralelo; T015–T019 mayormente secuencial
- **Phase 4**: T020–T021 paralelo; T022–T025 secuencial
- **Phase 5–6**: tests RED [P] paralelos dentro de la fase
- **Phase 7**: T034–T035 paralelo

---

## Parallel Example: User Story 1

```bash
# Tras T013 (foundational), lanzar en paralelo:
# T014 — LoginForm.test.tsx (RED)

# Tras T014 fallando, secuencial:
# T015 LoginForm.tsx → T016 LoginPage.tsx → T017 app/login/page.tsx → T018 wire → T019 stub page
```

## Parallel Example: User Story 2

```bash
# En paralelo:
# T020 protected-routes.test.ts
# T021 auth-redirect.test.ts

# Secuencial:
# T022 → T023 → T024 proxy.ts → T025 page fallback
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup
2. Phase 2: Foundational
3. Phase 3: User Story 1
4. **STOP and VALIDATE**: quickstart SC-02
5. Demo login funcional (sin guard edge completo hasta US2)

### Entrega incremental recomendada

1. Setup + Foundational → store mock listo
2. US1 → login + stub resumen (**MVP demo login**)
3. US2 → rutas protegidas (**SC-01**)
4. US3 → anti-login duplicado (**SC-03**)
5. US4 → logout dual (**SC-04**, **MO-003**)
6. Polish → Figma + gates

### Parallel Team Strategy

Tras Foundational:

- Dev A: US1 (login UI)
- Dev B: US2 (proxy + protected-routes) — coordinar T019 stub
- Dev C: US4 puede empezar tras US1+US2 en stub

---

## Notes

- Tareas [P] = archivos distintos, sin conflicto
- Etiqueta [USn] mapea a user stories 1–4 de `spec.md`
- No implementar `POST /api/token` ni `GET /api/settings` (**FR-006**)
- Credenciales mock: cualquier par no vacío (trim aplicado)
- Commit sugerido tras cada checkpoint de fase
